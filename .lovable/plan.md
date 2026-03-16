

# Xycle 랜딩페이지만 가져오기

## 복사 대상 파일

### 페이지 & 컴포넌트 (4개)
- `src/pages/StudentLogin.tsx` (1,623줄) — 메인 랜딩페이지
- `src/components/GradingDemo.tsx` (334줄) — 채점 체험 데모
- `src/components/AppMockup.tsx` (426줄) — 기능 목업 미리보기
- `src/components/CookieConsent.tsx` (118줄) — 쿠키 동의 배너

### SVG 에셋 (3개)
- `src/assets/logo.svg` — Xycle 풀 로고
- `src/assets/xycle-wordmark.svg` — 워드마크
- `src/assets/xycle-logomark.svg` — 로고마크

### 폰트 파일 (7개)
- `public/fonts/AirbnbCereal-*.otf` 전체 (Light, Book, Medium, Bold, ExtraBold, Black, W_Bd)

### Supabase 연동 (랜딩페이지 로그인 버튼용)
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts` (최소한의 타입)

### 인증 훅
- `src/hooks/useAuth.tsx` — AuthProvider + useAuth (로그인 상태 체크용)

### 설정 파일 업데이트
- **`index.css`**: Pretendard, IBM Plex Mono 폰트 import + Airbnb Cereal @font-face 선언 + warning/success CSS 변수 추가
- **`tailwind.config.ts`**: warning/success 컬러 추가
- **`index.html`**: 타이틀/메타 태그를 Xycle로 변경
- **`package.json`**: `framer-motion`, `embla-carousel-react`, `@supabase/supabase-js`, `next-themes` 의존성 추가

### 라우팅 (App.tsx)
- `AuthProvider`로 래핑
- `/` 라우트를 `StudentLogin` 컴포넌트로 변경

## 주의사항
- Supabase 인증(Google OAuth)은 Supabase 프로젝트가 연결되어야 실제로 동작합니다. 랜딩페이지 자체는 로그인 없이도 볼 수 있습니다.
- `useAuth`에서 로그인된 유저가 있으면 `navigate("/")`하는 로직은 랜딩 전용이므로 `/login`으로 경로를 분리하거나, 해당 redirect를 제거합니다.

