

## 대시보드 UI 개선 — 스트라바 스타일 적용

### 현재 문제점
- 대시보드가 3개 카드(PeerComparison, TodayStats, LiveFeed)를 단순 나열
- 모두 빈 상태(데이터 없음)로 표시되어 활력이 없음
- MockPeerCompare (AppMockup.tsx)에 이미 스트라바 스타일의 완성도 높은 목업이 존재하지만 실제 대시보드에는 반영 안 됨

### 스트라바 핵심 UI 패턴
1. **Activity Feed** — 카드 기반, 프로필 아바타 + 활동 요약 + 반응(Kudos)
2. **Stats at a glance** — 큰 숫자 + 작은 라벨, 그리드 레이아웃
3. **Progress bar / streak** — 시각적 진행률, 연속일 강조
4. **Social comparison** — 나 vs 타인 바 차트, 순위

### 개선 계획

**1. 히어로 영역 (상단)**
- 현재: 인사말 + 이름 (2줄 텍스트)
- 변경: 오늘 풀이 수를 **크게 표시** (MockPeerCompare의 "32 문제" 스타일)
- 연속 학습일 배지 (🔥 12일째)
- 동차생 평균 대비 메시지 ("▲ 평균보다 14문제 더")

**2. 스탯 그리드 (TodayStatsCard 교체)**
- 현재: 3열 아이콘+숫자
- 변경: MockGrowth 스타일의 2x2 그리드 (오늘 풀이, 이번 주, 연속 학습, 정답률 추이)
- 구분선 대신 gap-px로 구분하는 깔끔한 그리드

**3. 주간 비교 차트 (PeerComparisonCard 교체)**
- 현재: 단순 프로그레스 바 2개
- 변경: MockPeerCompare의 요일별 나/평균 막대 차트 적용
- 상위 N% 표시 유지

**4. 피드 (LiveFeed 개선)**
- 현재: 빈 상태 텍스트
- 변경: 목 데이터로 스트라바 피드 스타일 카드 표시
- 이름 블러 처리 + 🔥 Kudos 버튼
- 풀이량 바 차트 포함

**5. 파일 변경**

| 파일 | 변경 내용 |
|------|-----------|
| `Dashboard.tsx` | 히어로 영역 재구성, 컴포넌트 순서 조정 |
| `TodayStatsCard.tsx` | 2x2 그리드 스타일로 전면 교체 |
| `PeerComparisonCard.tsx` | 요일별 막대 차트 추가 |
| `LiveFeed.tsx` | 목 데이터 기본 제공, 피드 카드 디자인 개선 |

모든 컴포넌트는 목(mock) 데이터로 동작하며, 나중에 Supabase 연동 시 props로 교체하면 됩니다.

