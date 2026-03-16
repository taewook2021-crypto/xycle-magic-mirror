

## 구현 계획: 대시보드 + 회독표 (2개 핵심 페이지)

### 현재 상태
- 랜딩/로그인 페이지만 존재 (`/`)
- Supabase 연동 완료, 타입 정의 완료, 시드 데이터 준비됨
- 아직 DB 테이블은 미생성 (마이그레이션 미실행)

---

### 1. Supabase 마이그레이션 실행

7개 테이블 생성: `subjects`, `topics`, `sub_topics`, `books`, `chapters`, `questions`, `attempts`, `user_roles`
+ RLS 정책 + 인덱스. 이전 합의된 스키마 그대로.

추가: `attempts` 테이블에 `result` 컬럼 (`'correct' | 'wrong' | 'half'`) — O/X/세모 지원용.

---

### 2. 앱 라우팅 + 하단 네비게이션

```text
/           → 랜딩(로그인) — 기존 유지
/dashboard  → 대시보드 (로그인 후 메인)
/review     → 회독표
/grading    → 채점 (추후)
/analytics  → 분석 (추후)
```

- 모바일 하단 탭 바: 대시보드 / 회독표 / 채점 / 분석 (4탭, 아이콘+텍스트)
- 로그인 후 `/dashboard`로 리다이렉트
- `ProtectedRoute` 컴포넌트로 인증 보호

---

### 3. 대시보드 (`/dashboard`)

**위젯 3개 + 실시간 피드:**

1. **동차생 대비 내 위치** (히어로 카드)
   - "이번 주 풀이량 상위 23%" + 막대 차트 (나 vs 평균)
   - `attempts` 테이블 주간 집계

2. **오늘의 풀이 현황**
   - 오늘 푼 문제 수, 정답률, 연속 학습일(streak)

3. **실시간 학습 피드** (하단)
   - 카드 형식: `동차생 · 재무회계 · 김기동 연습서 · 3단원 · 8문제 · 방금 전 · 🔥 3`
   - 풀이량만 공개 (무료), 정답률은 블러+🔒 (유료 표시)
   - Supabase Realtime 구독으로 실시간 업데이트
   - 🔥 반응 버튼 (별도 테이블 `feed_reactions` 필요)

**추가 테이블:**
- `feed_reactions`: `id`, `attempt_id` (또는 feed_item_id), `user_id`, `created_at`
- `profiles`: `id` (FK→auth.users), `exam_type` (동차생/재시생 등), `display_name`

---

### 4. 회독표 (`/review`) — 노션 스타일

**레이아웃:**
```text
┌──────────────────────────────────────────────┐
│ [교재 선택 드롭다운/탭]                         │
├────────┬────────┬────────┬────────┬──────────┤
│ 문항   │ 1회독  │ 2회독  │ 3회독  │ ...      │
├────────┼────────┼────────┼────────┼──────────┤
│ Q1     │ O 3/15 │ O 3/18 │        │          │
│ Q2     │ X 3/15 │ △ 3/18 │        │          │
│ Q3     │ △ 3/15 │ O 3/18 │        │          │
│ ...    │        │        │        │          │
└────────┴────────┴────────┴────────┴──────────┘
색상: O=연초록, △=노랑, X=빨강, 빈칸=회색
```

**입력 방식 2가지 (토글 전환):**

- **실시간 모드**: 셀 클릭 1번=O, 2번=X, 꾹 누르면=△ (long press). 즉시 `attempts`에 저장
- **범위 모드**: 시작/끝 문항 설정 → 틀린 것만 클릭(X) → 나머지 자동 O 처리. △는 X 셀 재클릭으로 전환

**기능:**
- 색상 필터: "X만 보기", "△만 보기" 토글
- 회독 자동 판별: 같은 챕터를 다시 풀면 새 회차로 분류
- 각 셀에 풀이 일자 표시 (작은 텍스트)

---

### 5. 파일 구조

```text
src/
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx        # 하단 4탭 네비게이션
│   │   └── ProtectedRoute.tsx   # 인증 보호 래퍼
│   ├── dashboard/
│   │   ├── PeerComparisonCard.tsx  # 동차생 비교 위젯
│   │   ├── TodayStatsCard.tsx     # 오늘 풀이 현황
│   │   └── LiveFeed.tsx           # 실시간 학습 피드
│   └── review/
│       ├── ReviewTable.tsx        # 회독표 격자
│       ├── ReviewCell.tsx         # 개별 셀 (O/△/X + 색상)
│       └── BookSelector.tsx       # 교재 선택
├── pages/
│   ├── Dashboard.tsx
│   └── ReviewTable.tsx
└── hooks/
    ├── useAttempts.ts            # attempts CRUD
    └── useRealtimeFeed.ts        # Supabase Realtime 구독
```

---

### 6. 구현 순서

1. DB 마이그레이션 (테이블 + RLS + profiles/feed_reactions 추가)
2. 라우팅 + BottomNav + ProtectedRoute
3. 대시보드 페이지 (동차생 비교 카드 + 오늘 현황 + 실시간 피드)
4. 회독표 페이지 (교재 선택 → 문항×회차 격자 + O/△/X 입력 + 히트맵)

초기에는 목업 데이터로 UI를 먼저 구현하고, DB 연동은 테이블 생성 후 연결합니다.

