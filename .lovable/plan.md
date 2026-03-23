

## 대시보드 이전 레이아웃 복원 계획

현재 대시보드는 "교재 검색 + 필터 + 그리드 카드" 형태의 플랫 레이아웃입니다. 기존에 사용하던 컴포넌트들(DashboardHeader, DashboardHero, TodayStatsCard, SubjectProgressCard, LiveFeed 등)이 아직 파일로 남아있지만 Dashboard.tsx에서 사용되지 않고 있습니다.

### 복원할 레이아웃 구조

```text
┌─────────────────────────────────┐
│  DashboardHeader (D-day, 총풀이)  │
├─────────────────────────────────┤
│  TodayStatsCard (2×2 통계 그리드)  │
├─────────────────────────────────┤
│  SubjectProgressCard × N        │
│  (과목별 교재 목록 + 진도율)       │
├─────────────────────────────────┤
│  교재 추가 버튼                   │
├─────────────────────────────────┤
│  LiveFeed (동차생 비교 피드)       │
└─────────────────────────────────┘
```

### 수정 대상

**Dashboard.tsx 1개 파일만 수정** — 나머지 페이지(Profile, Ranking 등)는 변경 없음

### 변경 내용

1. **기존 import 제거**: `Search`, `Plus`, `BookOpen`, `TrendingUp/Down/Minus`, `Progress`, `getSubjectColor` 등 현재 플랫 레이아웃 전용 import 제거
2. **이전 컴포넌트 import 복원**: `DashboardHeader`, `getDDay`, `TodayStatsCard`, `SubjectProgressCard`, `LiveFeed`, `AddSubjectSheet` (교재 추가 시트)
3. **레이아웃 복원**:
   - 상단: `DashboardHeader` — D-day 카운트다운 + 총 풀이 수
   - 중단: `TodayStatsCard` — 오늘 풀이, 이번 주, 연속 학습, 정답률 추이 (2×2)
   - 과목별: `SubjectProgressCard` — 각 과목 아래 등록 교재 목록 + 진도율 바
   - 교재 추가: 버튼 + `AddSubjectSheet` 연동
   - 하단: `LiveFeed` — 수험생 비교 피드 (수험 상태 기반 비교 로직은 `useSocialFeed`에 이미 구현되어 있어 그대로 유지)
4. **검색/필터/그라데이션 카드 UI 제거**: 현재의 검색바, 필터 pill, 그라데이션 썸네일 카드 그리드 전체 제거

