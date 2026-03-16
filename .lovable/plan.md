

## 소셜 기능 개선

### 변경 사항

**1. 닉네임 입력 (profiles 테이블 신규)**
- `profiles` 테이블 생성: `id (FK auth.users)`, `display_name`, `is_public` (회독표 공개 여부, 기본 true)
- Google 로그인 후 닉네임 미설정 시 → 닉네임 입력 모달/페이지 표시
- `useAuth`에 profile 정보 추가

**2. LiveFeed UI 정리**
- `emoji` 필드 제거, 이름(닉네임)만 표시
- 깔끔한 리스트: 순위 번호 + 닉네임 + 풀이량 바 + 문제 수
- 기존 이모지/기호 모두 제거

**3. 교재별 평균 풀이량 표시**
- 피드를 "전체 풀이량" 대신 **내가 구독한 교재별** 평균으로 변경
- 예: "중급회계 연습서 — 동차생 평균 12문제, 나 18문제"
- DB 연동 전까지는 목 데이터로 구현

**4. 회독표 공개/비공개 설정**
- profiles.is_public 플래그로 제어
- 피드에서 닉네임 클릭 시 → 공개 유저면 회독표 열람 가능
- 비공개 유저는 풀이량만 표시, 상세 비공개

### 파일 변경

| 파일 | 내용 |
|------|------|
| Supabase 마이그레이션 | `profiles` 테이블 + RLS + 트리거 |
| `useAuth.tsx` | profile(display_name, is_public) 로드 |
| 신규: `NicknameSetup.tsx` | 최초 로그인 시 닉네임 입력 화면 |
| `LiveFeed.tsx` | emoji 제거, 교재별 평균 구조로 변경 |
| `Dashboard.tsx` | 목 데이터 구조 업데이트 |
| `FeedItem` 타입 | emoji 제거, bookTitle 추가 |

### 구현 순서
1. profiles 테이블 생성 + RLS
2. 닉네임 입력 UI
3. LiveFeed 리디자인 (교재별 평균)
4. 회독표 공개 설정 (profiles.is_public)

