

## 스터디 그룹 기능 — 초대 코드 기반

### 요약
프로필 페이지에서 스터디 그룹을 생성/가입할 수 있는 기능을 추가합니다. 초대 코드를 공유해 그룹에 가입하고, 그룹 내에서 랭킹, 피드, 진도 비교, 간단한 메모 소통이 가능합니다.

---

### 1. DB 마이그레이션

**`study_groups` 테이블**
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| name | text | 그룹명 (최대 30자) |
| invite_code | text UNIQUE | 6자리 영숫자 코드 |
| owner_id | uuid | 생성자 |
| max_members | int default 20 | 최대 인원 |
| created_at | timestamptz | |

**`study_group_members` 테이블**
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| group_id | uuid FK → study_groups | |
| user_id | uuid | |
| joined_at | timestamptz | |
| UNIQUE(group_id, user_id) | | |

**`group_messages` 테이블**
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| group_id | uuid FK → study_groups | |
| user_id | uuid | 작성자 |
| content | text | 메모/메시지 (최대 500자) |
| created_at | timestamptz | |

**RLS 정책**: 그룹 멤버만 해당 그룹 데이터 SELECT/INSERT 가능. `is_group_member(user_id, group_id)` security definer 함수로 재귀 방지.

**초대 코드 생성 함수**: `generate_invite_code()` — 랜덤 6자리 영숫자 반환.

---

### 2. 프로필 페이지 UI 추가

프로필 설정 카드 목록에 **"스터디 그룹"** 카드 추가:
- 아이콘: `Users`
- 내 그룹 목록 표시 (최대 3개 가입 가능)
- **"그룹 만들기"** / **"코드로 가입"** 버튼

---

### 3. 그룹 상세 페이지 (`/group/:id`)

탭 구조로 4가지 핵심 기능 제공:

```text
┌─────────────────────────────────┐
│ 📚 CPA 스터디 A반    [초대코드] │
├──────┬──────┬──────┬────────────┤
│ 랭킹 │ 피드 │ 진도 │   메모     │
└──────┴──────┴──────┴────────────┘
```

- **랭킹 탭**: 그룹 멤버의 교재별 풀이 수 순위 (기존 LiveFeed 로직 재활용)
- **피드 탭**: 그룹 멤버의 최근 학습 활동 스트림
- **진도 탭**: 그룹 멤버별 교재 진도율 비교 바 차트
- **메모 탭**: 간단한 메시지 리스트 (채팅 수준은 아닌 메모보드)

---

### 4. 새 파일 목록

| 파일 | 역할 |
|------|------|
| `src/hooks/useStudyGroup.ts` | 그룹 CRUD, 가입/탈퇴, 멤버 조회 |
| `src/pages/GroupDetail.tsx` | 그룹 상세 페이지 (4탭) |
| `src/components/group/GroupCard.tsx` | 프로필에 표시되는 그룹 카드 |
| `src/components/group/CreateGroupSheet.tsx` | 그룹 생성 바텀시트 |
| `src/components/group/JoinGroupSheet.tsx` | 코드 입력 가입 시트 |
| `src/components/group/GroupRanking.tsx` | 그룹 내 랭킹 탭 |
| `src/components/group/GroupFeed.tsx` | 그룹 피드 탭 |
| `src/components/group/GroupProgress.tsx` | 진도 비교 탭 |
| `src/components/group/GroupMemo.tsx` | 메모보드 탭 |

**라우팅**: `App.tsx`에 `/group/:id` 추가, BottomNav는 변경 없음 (프로필에서 진입).

---

### 5. 구현 순서

1. DB 마이그레이션 (테이블 3개 + RLS + 헬퍼 함수)
2. `useStudyGroup` 훅 구현
3. 프로필 페이지에 그룹 카드 + 생성/가입 시트 추가
4. 그룹 상세 페이지 4탭 구현
5. 라우팅 연결

