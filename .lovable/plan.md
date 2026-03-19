

## 오늘의 풀이왕 — 분류 기준 추가

### 현재
"오늘의 풀이왕" 탭은 오늘 푼 문제 수 기준 한 가지로만 순위를 매김.

### 변경
탭 내부에 정렬 기준 Select 드롭다운 추가. 기준 옵션:

| 값 | 라벨 | 설명 | 데이터 소스 |
|---|---|---|---|
| `today-count` | 오늘 풀이 수 | 오늘 푼 문제 수 (현재와 동일) | `attempts` where `attempted_at >= todayStart` |
| `total-count` | 누적 풀이 수 | 전체 기간 총 풀이 수 | `allAttempts` 전체 카운트 |
| `today-correct` | 오늘 정답률 | 오늘 정답 비율 (최소 5문제 이상만) | `attempts` where `attempted_at >= todayStart`, `result === 'correct'` |
| `streak` | 연속 학습일 | 최근 연속으로 풀이한 날 수 | `attempts`의 `attempted_at` 날짜별 그룹핑 |

### 수정 파일: `src/pages/Ranking.tsx`

1. **상태 추가**: `const [sortBy, setSortBy] = useState("today-count")`
2. **추가 쿼리**: `allAttempts`는 이미 있음. `streak`와 `today-correct` 계산을 위해 `todayAttempts` 쿼리에 `result` 필드 추가, `allAttempts` 쿼리에 `attempted_at` 필드 추가
3. **랭킹 계산 useMemo**: `sortBy`에 따라 다른 집계 로직 분기
   - `today-count`: 기존 로직
   - `total-count`: allAttempts 전체 카운트
   - `today-correct`: 오늘 correct 수 / 오늘 전체 수 (5문제 미만은 제외)
   - `streak`: 각 유저별 attempted_at 날짜를 역순 정렬 후 연속일 계산
4. **UI**: TabsContent "today" 상단에 작은 Select 드롭다운 배치, 카드 오른쪽 표시 값도 기준에 맞게 변경 (문제수 / 정답률% / N일)

DB 변경 없음. 기존 데이터로 모두 계산 가능.

