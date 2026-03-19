

## 대시보드 전면 교체: 회독표 서비스 대시보드

현재 localStorage 기반 타이머를 제거하고, Supabase에서 실제 학습 데이터를 불러와 과목별 학습 현황을 보여주는 대시보드로 교체합니다.

### UI 구성

```text
┌─────────────────────────────┐
│  D-241          통계  플래너  │  ← 다크 헤더
│     총 풀이: 342문제         │  ← 오늘/전체 총 풀이 수
├─────────────────────────────┤
│  과목    교재    최근활동     │  ← 탭
├─────────────────────────────┤
│  ● 재무관리    128/250  51% │  ← 과목별 진도 (attempts/questions)
│  ● 세법        87/200  44% │     프로그레스 바 + 정답률
│  ● 회계학     127/300  42% │
└─────────────────────────────┘
```

### 데이터 소스 (전부 Supabase)

- **과목 목록**: `subjects` 테이블에서 조회
- **문제 수**: `questions` → `chapters` → `books` → `subjects` 조인으로 과목별 총 문제 수
- **풀이 현황**: `attempts` 테이블에서 유저의 풀이 기록 집계 (풀이 수, 정답률)
- **교재 목록**: `user_books` + `books` 조인으로 유저가 추가한 교재
- **D-day**: 하드코딩 유지 (추후 Settings 연동)

### 수정 파일

**1. `src/pages/Dashboard.tsx`** — 전면 재작성
- localStorage/timer 로직 전부 제거
- `useAuth`로 유저 확인 후 Supabase에서 데이터 fetch
- 과목별 진도율 (풀이 문제 수 / 전체 문제 수), 정답률 표시
- 탭: "과목" (과목별 진도), "교재" (내 교재 목록), "최근활동" (최근 풀이 기록)

**2. `src/components/dashboard/DashboardHeader.tsx`** — TimerHeader 대체
- D-day + 총 풀이 문제 수 표시 (타이머 시간 대신)
- 동일한 다크 테마 유지

**3. `src/components/dashboard/SubjectProgressCard.tsx`** — SubjectTimer 대체
- 과목명, 풀이 수/전체 문제 수, 정답률, 프로그레스 바
- 과목별 고유 색상 (subjects 테이블에 color 컬럼 추가 or 프론트에서 인덱스 기반 할당)

**4. 기존 타이머 컴포넌트** — import 제거 (파일은 유지)
- `TimerHeader.tsx`, `SubjectTimer.tsx`, `AddSubjectSheet.tsx`

### DB 변경
- 없음. 기존 테이블(`subjects`, `questions`, `attempts`, `user_books`, `books`, `chapters`)로 충분

### 쿼리 설계
- 과목별 총 문제 수: `questions` JOIN `chapters` JOIN `books` → `subject_id` 기준 group by
- 유저 풀이 현황: `attempts` JOIN `questions` JOIN `chapters` JOIN `books` → `subject_id` 기준 집계
- 최근 활동: `attempts` 최근 N건 + question/chapter/book 정보 조인

