

## 동차생 평균 진도 위치 표시 기능

사용자의 수험 상태(동차생/유예생 등)와 동일한 집단의 평균적인 학습 위치를 교재별로 표시합니다. 예: "동차생 평균: 2회독 · 재고자산"

### 표시 위치

`SubjectProgressCard` 내 각 교재 항목 아래에 한 줄로 표시:

```text
📖 중급회계 연습서                    >
████████░░░░  120/300 · 진도 40%   정답률 72%
동차생 평균: 2회독 · Ch.8 재고자산
```

### 데이터 수집 방식

`useDashboardData` 또는 별도 hook(`usePeerAvgProgress`)에서:

1. **공개 프로필** 중 나와 같은 `exam_status`인 유저 목록 조회
2. 해당 유저들의 **attempts** 데이터에서 교재별로:
   - 평균 `round` (회독 수) 계산 — `attempts.round` 필드의 max 값의 평균
   - 가장 최근 풀이 챕터(최빈 또는 최근) → 해당 챕터 제목 표시
3. 결과를 `Map<bookId, { avgRound: number, avgChapterTitle: string }>` 형태로 반환

### 수정 파일

1. **`src/hooks/usePeerAvgProgress.ts`** (신규)
   - 같은 exam_status 그룹의 공개 유저 attempts를 집계
   - 교재별 평균 회독 수, 평균 진도 챕터 계산
   - `{ bookId, avgRound, avgChapterTitle, peerCount }` 배열 반환

2. **`src/components/dashboard/SubjectProgressCard.tsx`**
   - props에 `peerAvgMap` 추가 (bookId → 평균 진도 정보)
   - 각 교재 진도 바 아래에 "동차생 평균: N회독 · 챕터명" 라벨 추가
   - 나와 비교하여 앞서면 초록, 뒤처지면 빨간색 텍스트

3. **`src/pages/Dashboard.tsx`**
   - `usePeerAvgProgress` hook 호출
   - `SubjectProgressCard`에 `peerAvgMap` prop 전달

### 쿼리 로직 (usePeerAvgProgress)

```text
1. profiles에서 exam_status = 내 상태 & is_public = true 인 유저 ID 목록
2. 해당 유저들의 attempts → question → chapter → book 매핑
3. 교재별로:
   - 각 유저의 max(round) → 전체 평균 = avgRound
   - 각 유저의 가장 최근 attempt의 chapter → 최빈 chapter = avgChapterTitle
4. 내 등록 교재(user_books)에 해당하는 것만 반환
```

### UI 디자인

- 폰트: `text-[10px]` muted 색상, 같은 줄에 아이콘 없이 간결하게
- 형식: `{수험상태} 평균: {N}회독 · {챕터명}`
- 데이터 없을 시 해당 라벨 숨김

