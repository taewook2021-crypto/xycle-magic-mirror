

## CSV 데이터 → Supabase 적재 계획

### 1. 스키마 변경 (Migration)

`questions` 테이블 수정:
- `correct_answer` → nullable로 변경 (O/X만 기록하므로 불필요)
- `is_essential` (boolean, default false) 추가 — v/vv 둘 다 true로 저장
- `exam_year` (text, nullable) 추가 — "99년" → "1999" 등 정규화

### 2. 데이터 삽입 (INSERT)

CSV에서 파싱한 결과를 SQL로 변환:

| 테이블 | 데이터 |
|---|---|
| `subjects` | 재무관리 (1건) |
| `books` | 재무관리 예제, 재무관리 기출, 재무관리 실전 (3건) |
| `chapters` | 각 교재별 Ch.1~Ch.17 (교재마다 다름, 총 ~45건) |
| `questions` | 예제 178건 + 기출 179건 + 실전 48건 = 405건 |

**단원별 정렬 원칙**: 같은 단원 내에서 예제 → 기출 → 실전 순서로 `display_order` 부여.

### 3. TypeScript 타입 업데이트

`src/integrations/supabase/types/database.ts`의 `Question` 인터페이스:
- `correct_answer: number` → `correct_answer: number | null`
- `is_essential: boolean` 추가
- `exam_year: string | null` 추가

### 4. 기존 코드 수정

- `GradingDemo.tsx` — `correct_answer` 참조하는 부분은 하드코딩 데모이므로 영향 없음
- `ReviewGrid`, `ReviewCell` 등 — `correct_answer` 직접 참조 없으므로 영향 없음

### 5. CSV 파싱 세부사항

- 필수표시: 열 C/M/W에 `v` 또는 `vv` → `is_essential = true`
- 기출연도: 열 S에 "99년", "14년" 등 → 2자리는 2000 이전은 19xx, 이후는 20xx로 변환
- 챕터 행: "Ch.숫자 제목" 패턴으로 감지
- 문항 행: 번호 열에 숫자가 있는 행

