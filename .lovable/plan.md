

## 회독표 열람 + 공개/비공개 + 상호 공개 보상 시스템

### 핵심 아이디어: "공개한 사람만 남의 것을 볼 수 있다"

스트라바의 플라이바이처럼, **내가 공개해야 남도 볼 수 있는 상호주의** 구조. 이러면 공개할 인센티브가 자연스럽게 생김 — 관음하려면 나도 벗어야 한다.

### 변경 내용

**1. ReviewGrid에 `readOnly` 모드 추가**
- `ReviewGrid`에 `readOnly` prop 추가 → 실시간 모드 스위치 숨기고, 셀 클릭 비활성화
- 필터 버튼은 유지 (읽기 전용이어도 X만/O만 필터는 유용)

**2. 피어 회독표 열람 시트 (PeerReviewSheet)**
- `PeerProfileSheet`에서 "회독표 보기" 클릭 시 → 새 풀스크린 시트가 열림
- 상단에 유저 닉네임 + 교재 선택 탭
- 아래에 `ReviewGrid` (readOnly=true) + 목 데이터
- **내가 비공개인 경우**: "내 회독표를 공개하면 다른 수험생의 회독표를 열람할 수 있습니다" 메시지 + "공개로 전환" 버튼

**3. 공개/비공개 토글**
- `PeerProfileSheet` 또는 대시보드 어딘가에 내 프로필 공개 설정 토글 추가
- 간단하게 대시보드 상단 또는 피어 프로필 시트 내 "내 설정" 영역에 Switch 배치
- `useAuth`의 `setProfile`로 상태 반영 (DB 연동은 추후)

**4. 상호 공개 보상 로직**
- 비공개 유저가 남의 회독표 보기 시도 → "공개 전환" 유도 메시지
- 공개 유저에게만 보이는 UI: 피어 프로필에서 "회독표 보기" 버튼 활성화
- 비공개 유저: 버튼에 자물쇠 아이콘 + "내 회독표를 공개하면 열람 가능" 텍스트

### 파일 변경

| 파일 | 내용 |
|------|------|
| `ReviewGrid.tsx` | `readOnly` prop 추가, 조건부 컨트롤 렌더링 |
| `ReviewCell.tsx` | `readOnly` prop → 클릭/터치 이벤트 무시 |
| 신규: `PeerReviewSheet.tsx` | 풀스크린 시트 — 교재 탭 + 읽기전용 ReviewGrid |
| `PeerProfileSheet.tsx` | "회독표 보기" 버튼에 상호공개 로직 + PeerReviewSheet 연결 |
| `Dashboard.tsx` | 내 공개 상태를 LiveFeed/PeerProfileSheet에 전달, 목 회독 데이터 추가 |

