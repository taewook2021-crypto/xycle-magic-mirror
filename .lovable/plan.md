

## 공개 그룹 목록 페이지 추가

### 개요
별도의 `/groups` 페이지를 만들어 공개 그룹을 브라우징하고 바로 가입할 수 있게 합니다. 기존 초대 코드 방식은 유지하면서, 공개 그룹은 코드 없이 원클릭 가입이 가능합니다.

### DB 변경

| 변경 | 내용 |
|------|------|
| `study_groups` 테이블 | `is_public boolean NOT NULL DEFAULT false` 컬럼 추가 |
| `study_groups` 테이블 | `description text` 컬럼 추가 (그룹 소개 한줄) |
| RLS 정책 | 공개 그룹 SELECT 정책 추가: `is_public = true`이면 누구나 조회 가능 |

### UI 변경

| 파일 | 작업 |
|------|------|
| `CreateGroupSheet.tsx` | 공개/비공개 스위치 + 그룹 설명 입력란 추가 |
| 새 `src/pages/Groups.tsx` | 공개 그룹 목록 페이지. 검색, 멤버 수, 설명 표시. "가입" 버튼으로 즉시 가입 |
| `GroupCard.tsx` | "공개 그룹 찾기" 버튼 추가 → `/groups`로 이동 |
| `App.tsx` | `/groups` 라우트 추가 |
| `useStudyGroup.ts` | `usePublicGroups()` 훅 추가 (공개 그룹 목록 조회) |
| `GroupDetail.tsx` | 그룹 설명 표시, 소유자가 공개/비공개 전환 가능 |

### 공개 그룹 목록 페이지 구성
- 상단: 뒤로가기 + "스터디 그룹 찾기" 타이틀
- 검색바: 그룹명으로 필터링
- 그룹 카드 리스트: 그룹명, 설명, 멤버 수/최대 인원, "가입" 버튼
- 이미 가입한 그룹은 "가입됨" 표시
- 3개 그룹 가입 제한 안내

### 가입 흐름
공개 그룹 → "가입" 버튼 → 기존 `useJoinGroup` 로직 재활용 (초대 코드 대신 group_id로 직접 insert) → 즉시 가입 완료

