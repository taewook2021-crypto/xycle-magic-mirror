

## Study Group 버그 수정 계획

### 1. 그룹 삭제 로직 구현

**현재 문제**: 오너가 "그룹 삭제" 버튼을 누르면 `useLeaveGroup`만 호출되어 멤버 레코드만 삭제되고, `study_groups` 테이블의 그룹은 고아 상태로 남음.

**수정 방법**:
- `useStudyGroup.ts`에 `useDeleteGroup` 훅 추가 — `study_groups` 테이블에서 해당 그룹 DELETE (CASCADE로 멤버도 자동 삭제됨... 아닌데, FK가 없으므로 멤버 먼저 삭제 후 그룹 삭제)
- `study_group_members`에 `group_id`로 전체 멤버 DELETE → `study_groups`에서 그룹 DELETE
- `GroupDetail.tsx`에서 `isOwner`일 때 `useDeleteGroup` 호출하도록 분기 처리

### 2. 가입 시 3개 제한 서버 검증

**현재 문제**: UI에서만 버튼 숨김. `useJoinGroup`에서 현재 가입 그룹 수를 체크하지 않음.

**수정 방법**:
- `useJoinGroup`의 `mutationFn` 앞부분에서 `study_group_members`를 현재 유저 기준으로 count 조회
- 3개 이상이면 에러 throw ("최대 3개 그룹까지 가입할 수 있습니다.")

### 3. 닉네임 편집 카드 복원

**현재 문제**: `Profile.tsx`에 `handleSaveNickname` 로직과 `Pencil` import은 있지만 렌더링에 닉네임 편집 UI가 없음.

**수정 방법**:
- 수험 상태 카드 위에 닉네임 편집 카드 추가 (Pencil 아이콘 + Input + 저장 버튼)
- 기존 `handleSaveNickname` 함수 그대로 활용

### 4. 그룹 멤버용 RLS 정책 추가 (attempts, user_books)

**현재 문제**: `is_public = false`인 멤버의 attempts/user_books가 그룹 랭킹·피드·진도에서 조회 불가.

**수정 방법** (SQL 마이그레이션):
- `is_group_member` 함수를 활용하여 같은 그룹 소속 여부를 체크하는 security definer 함수 `is_in_same_group(_viewer uuid, _target uuid)` 생성
- `attempts` 테이블에 SELECT 정책 추가: 같은 그룹 멤버면 조회 허용
- `user_books` 테이블에 SELECT 정책 추가: 같은 그룹 멤버면 조회 허용

```sql
CREATE OR REPLACE FUNCTION public.is_in_same_group(_viewer uuid, _target uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM study_group_members m1
    JOIN study_group_members m2 ON m1.group_id = m2.group_id
    WHERE m1.user_id = _viewer AND m2.user_id = _target
  )
$$;

CREATE POLICY "Group members can see each other attempts"
  ON public.attempts FOR SELECT TO authenticated
  USING (is_in_same_group(auth.uid(), user_id));

CREATE POLICY "Group members can see each other books"
  ON public.user_books FOR SELECT TO authenticated
  USING (is_in_same_group(auth.uid(), user_id));
```

### 5. 그룹 피드에서 정오 여부 제거 확인

현재 `GroupFeed.tsx`와 `GroupRanking.tsx`는 문제 수(`count`)만 표시하고 있으므로 추가 작업 불필요.

---

### 수정 파일 요약

| 파일 | 변경 내용 |
|------|-----------|
| `src/hooks/useStudyGroup.ts` | `useDeleteGroup` 추가, `useJoinGroup`에 3개 제한 검증 |
| `src/pages/GroupDetail.tsx` | 오너일 때 삭제 로직 분기 |
| `src/pages/Profile.tsx` | 닉네임 편집 카드 렌더링 복원 |
| SQL 마이그레이션 | `is_in_same_group` 함수 + attempts/user_books RLS 정책 |

