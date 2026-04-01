

## 랭킹 페이지 1,000행 제한 문제

### 발견된 문제

랭킹 페이지(`src/pages/Ranking.tsx`)와 소셜 피드(`src/hooks/useSocialFeed.ts`)에서 Supabase 1,000행 제한에 걸리는 쿼리가 있습니다. 대시보드에서는 이미 `fetchAllRows` 헬퍼로 수정했지만, 랭킹/소셜 피드에는 적용되지 않았습니다.

| 파일 | 쿼리 | 예상 행 수 | 문제 |
|------|------|-----------|------|
| `Ranking.tsx` L171-179 | `allAttempts` (전체 attempts) | 5,575+ | 1,000행만 가져옴 → 누적 풀이수/연속학습일 부정확 |
| `Ranking.tsx` L181-187 | `questions` (전체 questions) | 3,414+ | 1,000행만 가져옴 → 교재별 진도 계산 부정확 |
| `useSocialFeed.ts` L27-35 | `recentAttempts` (오늘 attempts) | 하루 500 제한이라 OK | — |
| `useSocialFeed.ts` L52-59 | `questions` (전체) | 3,414+ | 1,000행만 가져옴 |

### 실시간 업데이트
- Realtime subscription은 정상 동작 중 (attempts, profiles 테이블 변경 감지 → 쿼리 무효화)
- 단, **데이터가 잘려서 들어오므로** 실시간이어도 부정확한 데이터가 갱신되는 상태

### 수정 방법

1. **`src/pages/Ranking.tsx`** — `allAttempts`와 `questions` 쿼리에 `fetchAllRows` 페이지네이션 헬퍼 적용
2. **`src/hooks/useSocialFeed.ts`** — `questions` 쿼리에 동일 헬퍼 적용

`fetchAllRows` 헬퍼는 이미 `useDashboardData.ts`에 구현되어 있으므로, 공용 유틸로 추출하여 재사용합니다.

### 수정 파일

| 파일 | 작업 |
|------|------|
| `src/lib/supabaseHelpers.ts` | `fetchAllRows` 유틸 추출 (새 파일) |
| `src/pages/Ranking.tsx` | `allAttempts`, `questions` 쿼리에 페이지네이션 적용 |
| `src/hooks/useSocialFeed.ts` | `questions` 쿼리에 페이지네이션 적용 |
| `src/hooks/useDashboardData.ts` | 기존 로컬 헬퍼를 공용 import로 교체 |

DB 변경 없음. 코드 변경 4개 파일.

