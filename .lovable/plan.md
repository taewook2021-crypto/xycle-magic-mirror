

## 내비게이션 구조 변경 + 랭킹 & 프로필 페이지 추가

### 현재 → 변경

```text
현재: 대시보드 | 채점 | 분석 | 설정  (4탭)
변경: 대시보드 | 랭킹 | 프로필        (3탭)
```

채점/분석/설정 탭 제거. 설정 기능(닉네임, 공개 여부, 로그아웃)은 프로필 페이지 안에 통합.

---

### 1. DB 변경: `follows` 테이블 생성

팔로우/팔로워 소셜 기능을 위한 테이블 추가.

```sql
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
-- RLS: 자신의 팔로우만 insert/delete, 모든 authenticated가 select
```

---

### 2. 랭킹 페이지 (`/ranking`)

**핵심 기능:**
- **그룹 필터**: 전체 / 초시 / 재시 / 유예 / 동차 — `profiles.exam_status` 기준으로 필터
- **오늘의 풀이왕**: 오늘 `attempts` 테이블 기준, 총 풀이량 순위 (상위 표시)
- **교재별 순위 탭**: 교재를 선택하면 해당 교재 내 풀이량/진도율 순위
- **평균 진도 비교**: 선택된 그룹의 교재별 평균 진도(풀이 비율) vs 나

데이터는 모두 기존 `attempts`, `questions`, `chapters`, `books`, `profiles` 테이블에서 집계. 공개 유저(`is_public = true`)만 랭킹에 노출.

---

### 3. 프로필 페이지 (`/profile`)

**핵심 기능:**
- 상단: 닉네임, 수험 상태, 팔로워/팔로잉 수
- 팔로우/언팔로우 버튼 (타인 프로필 조회 시)
- 기존 설정 기능 통합: 닉네임 변경, 공개 설정, 로그아웃
- 팔로워/팔로잉 목록 시트

---

### 4. 수정 파일 목록

| 파일 | 변경 |
|------|------|
| `BottomNav.tsx` | 3탭으로 변경 (대시보드, 랭킹, 프로필) |
| `SideNav.tsx` | 동일하게 3탭 |
| `App.tsx` | `/ranking`, `/profile` 라우트 추가, `/grading`, `/analytics`, `/settings` 제거 |
| `src/pages/Ranking.tsx` | 신규 — 그룹별 랭킹, 오늘 풀이왕, 교재별 순위 |
| `src/pages/Profile.tsx` | 신규 — 프로필 + 설정 통합 + 팔로우 기능 |
| `Grading.tsx`, `Analytics.tsx`, `Settings.tsx` | 삭제 (또는 미사용 처리) |

---

### 5. 구현 순서

1. `follows` 테이블 마이그레이션 + RLS
2. BottomNav/SideNav 3탭 구조로 변경
3. App.tsx 라우트 정리
4. Ranking 페이지 구현 (그룹 필터 + 풀이량 순위 + 교재별 진도)
5. Profile 페이지 구현 (기존 Settings 기능 통합 + 팔로우/팔로워)

