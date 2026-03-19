

## 소셜 기능 강화: 유저 검색 + 타인 회독표 조회

### 1. 유저 검색 & 팔로우 (랭킹 페이지 상단)

**`src/pages/Ranking.tsx` 수정**

- 랭킹 페이지 상단에 검색 Input 추가
- 닉네임으로 공개 유저 검색 (`profiles` 테이블에서 `display_name ilike '%keyword%'`, `is_public = true`)
- 검색 결과를 드롭다운으로 표시, 클릭 시 기존 프로필 시트 열림 (팔로우/언팔로우 가능)

---

### 2. 타인 회독표 조회 (읽기 전용)

현재 `PeerReviewSheet`에 "준비 중" 플레이스홀더가 있음. 이를 실제 데이터로 교체.

**흐름**: 랭킹에서 유저 클릭 → 프로필 시트에 "회독표 보기" 버튼 → 해당 유저의 회독표를 읽기 전용으로 표시

**구현:**

1. **랭킹 프로필 시트 확장** (`src/pages/Ranking.tsx`)
   - 선택된 유저의 `user_books` → `books` 조회하여 교재 목록 표시
   - "회독표 보기" 버튼 추가 (내가 공개일 때만 활성, 상호주의 모델 유지)
   - 클릭 시 해당 유저의 교재 선택 → 읽기 전용 회독표 시트 오픈

2. **읽기 전용 회독표 시트** (새 컴포넌트 또는 `PeerReviewSheet` 개선)
   - 선택된 교재의 chapters → questions → 해당 유저의 attempts 조회
   - 기존 `ReviewGrid` 컴포넌트를 `readOnly` 모드로 재사용 (이미 `readOnly` prop 존재)
   - `ReviewGrid`에 `userId` prop 추가하여 타인의 데이터를 불러올 수 있게 확장

3. **RLS 확인**: `attempts` 테이블에 이미 `is_public=true` 유저의 attempts를 SELECT 가능한 정책 있음. `user_books`는 현재 자기 것만 읽기 가능 → **새 RLS 정책 추가 필요** (공개 유저의 user_books를 authenticated가 조회 가능)

---

### 3. DB 변경

**`user_books` 테이블에 RLS 정책 추가:**
```sql
CREATE POLICY "Public user books readable"
ON public.user_books FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE profiles.id = user_books.user_id
  AND profiles.is_public = true
));
```

---

### 4. 수정 파일 목록

| 파일 | 변경 |
|------|------|
| `src/pages/Ranking.tsx` | 검색 Input 추가 + 프로필 시트에 교재 목록 & "회독표 보기" 버튼 |
| `src/components/review/ReviewGrid.tsx` | `userId` prop 추가 — 타인의 attempts/skips 로드 지원 |
| `src/components/dashboard/PeerReviewSheet.tsx` | 실제 `ReviewGrid(readOnly, userId)` 렌더링으로 교체 |
| 마이그레이션 | `user_books` 공개 유저 SELECT 정책 |

---

### 5. 구현 순서

1. `user_books` RLS 마이그레이션
2. `ReviewGrid`에 `userId` prop 추가 (타인 데이터 로드)
3. `PeerReviewSheet` 개선 — 실제 회독표 표시
4. 랭킹 프로필 시트에 교재 목록 + 회독표 보기 버튼
5. 랭킹 페이지 상단 유저 검색 기능

