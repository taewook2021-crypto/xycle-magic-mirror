

## Kudos(응원) 기능 추가

### 개요
유저가 다른 유저에게 "응원" 버튼을 눌러 kudos를 보낼 수 있는 기능. 랭킹 페이지의 프로필 카드와 랭킹 리스트에서 사용.

### 1. DB 테이블 생성 (마이그레이션)

`kudos` 테이블:
- `id` uuid PK
- `sender_id` uuid (보내는 사람)
- `receiver_id` uuid (받는 사람)
- `created_at` timestamptz default now()
- unique(sender_id, receiver_id, created_at::date) → 하루에 같은 사람에게 1번만

RLS 정책:
- SELECT: authenticated, `true` (누구나 kudos 수 조회 가능)
- INSERT: authenticated, `sender_id = auth.uid()`
- DELETE: 없음 (취소 불가)

### 2. PeerProfileCard에 응원 버튼 추가

`src/components/ranking/PeerProfileCard.tsx`:
- 팔로우/회독표 버튼 옆에 👏 응원 버튼 추가
- 오늘 이미 보냈으면 비활성화 + "응원함 ✓" 표시
- 받은 총 kudos 수를 팔로워/팔로잉 옆에 표시

### 3. 랭킹 리스트 행에 응원 버튼 추가

`src/pages/Ranking.tsx`:
- 각 랭킹 행 우측에 작은 👏 버튼 (프로필 카드 안 열고도 바로 응원 가능)
- 오늘 이미 보낸 유저는 버튼 색상 변경
- 자기 자신 행에는 받은 kudos 수만 표시

### 4. 토스트 피드백

응원 성공 시 `"{이름}님에게 응원을 보냈습니다 👏"` 토스트

### 수정 파일 요약

| 파일 | 변경 |
|------|------|
| SQL 마이그레이션 | `kudos` 테이블 + RLS |
| `src/components/ranking/PeerProfileCard.tsx` | 응원 버튼 + 받은 kudos 수 표시 |
| `src/pages/Ranking.tsx` | 랭킹 행에 인라인 응원 버튼, kudos 쿼리/뮤테이션 추가 |

