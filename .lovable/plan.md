

## 설정 페이지 추가

### 변경 파일

**1. 신규: `src/pages/Settings.tsx`**
- 섹션별 카드 레이아웃:
  - **프로필**: 닉네임 변경 (Input + 저장 버튼), 현재 닉네임 표시
  - **공개 설정**: `is_public` Switch 토글 + 비공개 전환 시 경고 ("비공개로 전환하면 다른 수험생의 회독표를 열람할 수 없습니다")
  - **알림 설정**: 학습 리마인더 on/off, 동차생 활동 알림 on/off (로컬 상태, 추후 DB 연동)
  - **계정**: 로그아웃 버튼
- `useAuth`에서 user, profile, setProfile, signOut 가져와서 사용
- 닉네임 저장 시 supabase profiles 테이블 update

**2. `src/components/layout/BottomNav.tsx`**
- Settings 아이콘 탭 추가 (lucide `Settings` 아이콘, path: `/settings`)

**3. `src/components/layout/SideNav.tsx`**
- 하단에 설정 메뉴 항목 추가

**4. `src/App.tsx`**
- `/settings` 라우트 추가 (ProtectedRoute 래핑)

