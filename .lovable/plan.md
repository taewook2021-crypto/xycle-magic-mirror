

## 문제 원인

`seed_financial_management.sql`이 `INSERT INTO public.questions ...`를 실행하려 하지만, **테이블 자체가 아직 생성되지 않았습니다.** 프로젝트에 `CREATE TABLE` SQL이 전혀 없습니다. 즉, Supabase에 `subjects`, `books`, `chapters`, `questions` 등의 테이블이 만들어진 적이 없습니다.

## 해결 계획

**Migration 도구를 사용하여 테이블을 생성합니다.** 그 후 seed 데이터를 Insert 도구로 적재합니다.

### Step 1 — 테이블 생성 (Migration)

다음 테이블들을 순서대로 생성:

1. `subjects` (id, name, display_order, created_at)
2. `topics` (id, subject_id FK, name, display_order, created_at)
3. `sub_topics` (id, topic_id FK, name, display_order, created_at)
4. `books` (id, subject_id FK, title, author, display_order, created_at)
5. `chapters` (id, book_id FK, title, chapter_number, display_order, created_at)
6. `questions` (id, chapter_id FK, sub_topic_id FK nullable, question_number, correct_answer nullable, is_essential boolean, exam_year text nullable, created_at)
7. `attempts` (id, user_id FK, question_id FK, student_answer, is_correct, attempted_at)
8. `user_roles` (id, user_id FK, role app_role enum)

각 테이블에 RLS를 활성화하고 기본 정책을 설정합니다.

### Step 2 — Seed 데이터 삽입 (Insert 도구)

`seed_financial_management.sql`의 내용을 Insert 도구로 실행하여 재무관리 과목, 교재, 챕터, 문항 데이터를 적재합니다.

기존 `seed.sql`의 중급회계 데이터도 함께 삽입합니다.

