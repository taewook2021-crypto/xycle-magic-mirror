

## 회독표 상호 공개 기능 문제 분석 및 수정 계획

### 현재 문제점

1. **"공개로 전환하기" 버튼이 동작하지 않음**: `Ranking.tsx`에서 `PeerReviewSheet`에 `onGoPublic` 콜백을 전달하지 않아, 비공개 유저가 잠금 화면에서 "공개로 전환하기"를 눌러도 아무 일도 안 일어남
2. **프로필 시트에 상호주의 안내 부재**: 비공개 유저가 "회독표" 버튼을 누르면 시트가 열린 후에야 잠금 화면이 보임 — 버튼 자체에 잠금 표시가 없음
3. **공개 전환 후 상태 반영 안 됨**: `onGoPublic`이 호출되더라도 `useAuth`의 profile 상태와 Supabase를 동시에 업데이트하는 로직이 Ranking에 없음

### 수정 내용

**`src/pages/Ranking.tsx`**
- `onGoPublic` 핸들러 추가: Supabase `profiles.is_public = true` 업데이트 + `setProfile` 호출로 즉시 상태 반영
- 이 핸들러를 `PeerReviewSheet`에 `onGoPublic` prop으로 전달
- 프로필 시트의 "회독표" 버튼에 비공개일 때 잠금 아이콘 + 비활성 표시 추가, 또는 클릭 시 바로 공개 전환 유도 모달

**`src/components/dashboard/PeerReviewSheet.tsx`**
- 현재 코드는 이미 `onGoPublic` prop을 받아 잠금 화면에서 사용하도록 되어 있으므로, 변경 불필요

### 구현 순서

1. `Ranking.tsx`에 `handleGoPublic` 함수 작성 (Supabase update + setProfile)
2. `PeerReviewSheet`에 `onGoPublic={handleGoPublic}` 전달
3. 프로필 시트 "회독표" 버튼 UX 개선 — 비공개 시 잠금 아이콘과 안내 텍스트 표시

