-- ===== 20260324024909_3dbdb4df-17a0-413a-b213-c30358a966be.sql =====
-- Helper function: generate 6-char invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists_already boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.study_groups WHERE invite_code = code) INTO exists_already;
    IF NOT exists_already THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- study_groups table
CREATE TABLE public.study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  invite_code text UNIQUE NOT NULL DEFAULT public.generate_invite_code(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  max_members integer NOT NULL DEFAULT 20,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;

-- study_group_members table
CREATE TABLE public.study_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

-- Security definer function to check membership (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id uuid, _group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE user_id = _user_id AND group_id = _group_id
  )
$$;

-- RLS for study_groups
CREATE POLICY "Members can read their groups"
  ON public.study_groups FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), id) OR owner_id = auth.uid());

CREATE POLICY "Authenticated can create groups"
  ON public.study_groups FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owner can update group"
  ON public.study_groups FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owner can delete group"
  ON public.study_groups FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- RLS for study_group_members
CREATE POLICY "Members can read group members"
  ON public.study_group_members FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), group_id));

CREATE POLICY "Users can join groups"
  ON public.study_group_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups"
  ON public.study_group_members FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ===== 20260324025012_bf0d3bdb-4e56-426d-8dba-471ff73cd42c.sql =====
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code text;
  exists_already boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.study_groups WHERE invite_code = code) INTO exists_already;
    IF NOT exists_already THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- ===== 20260324025236_a3de741f-428c-4084-9ab1-5042506f9ce7.sql =====
-- Allow any authenticated user to find a group by invite_code (for joining)
CREATE POLICY "Anyone can find group by invite code"
  ON public.study_groups FOR SELECT TO authenticated
  USING (true);

-- ===== 20260324030940_6339d1bc-7186-46e8-bebd-4017e94610de.sql =====

-- Function to check if two users share a group
CREATE OR REPLACE FUNCTION public.is_in_same_group(_viewer uuid, _target uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM study_group_members m1
    JOIN study_group_members m2 ON m1.group_id = m2.group_id
    WHERE m1.user_id = _viewer AND m2.user_id = _target
  )
$$;

-- Group members can see each other's attempts (count only, no correctness leak)
CREATE POLICY "Group members can see each other attempts"
  ON public.attempts FOR SELECT TO authenticated
  USING (is_in_same_group(auth.uid(), user_id));

-- Group members can see each other's books
CREATE POLICY "Group members can see each other books"
  ON public.user_books FOR SELECT TO authenticated
  USING (is_in_same_group(auth.uid(), user_id));

-- Group members can see each other's profiles
CREATE POLICY "Group members can see each other profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (is_in_same_group(auth.uid(), id));

-- Allow owner to delete all members when deleting group
CREATE POLICY "Owner can delete group members"
  ON public.study_group_members FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM study_groups
      WHERE study_groups.id = study_group_members.group_id
      AND study_groups.owner_id = auth.uid()
    )
  );

-- ===== 20260324150802_b7a81729-f2b5-4acc-805b-1a905c860e88.sql =====
-- Admin can read all profiles
CREATE POLICY "Admin can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read all user_books
CREATE POLICY "Admin can read all user_books"
ON public.user_books
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read all attempts
CREATE POLICY "Admin can read all attempts"
ON public.attempts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ===== 20260324151526_7494f044-c17f-42dc-8a67-dc8d1d5376c3.sql =====
INSERT INTO public.user_roles (user_id, role) 
VALUES ('57df96ea-6038-4dfe-a632-6d6f102816f8', 'admin')
ON CONFLICT DO NOTHING;

-- ===== 20260327080617_db815711-9b5b-460a-a9b5-a5ee3a0ab1e3.sql =====
-- 정우승 교재 2권 및 관련 데이터 삭제
DELETE FROM attempts WHERE question_id IN (
  SELECT q.id FROM questions q JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM user_question_memos WHERE question_id IN (
  SELECT q.id FROM questions q JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM user_question_skips WHERE question_id IN (
  SELECT q.id FROM questions q JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM questions WHERE chapter_id IN (
  SELECT id FROM chapters WHERE book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM chapters WHERE book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415');
DELETE FROM user_books WHERE book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415');
DELETE FROM books WHERE id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415');

-- ===== 20260327091053_90af7c83-91b4-410d-b5c7-f4e528efa9a9.sql =====
CREATE TABLE public.kudos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  created_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sender_id, receiver_id, created_date)
);

ALTER TABLE public.kudos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read kudos"
  ON public.kudos FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can send kudos"
  ON public.kudos FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- ===== 20260328030014_cff97321-3f5c-4f90-9f36-91812a3cde20.sql =====

-- 교재: 원가관리회계연습 2판 / 이승우
INSERT INTO public.books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'b2000000-0000-0000-0000-000000000001',
  '54e4b9a1-998f-4584-b56a-3c954808d94f',
  '원가관리회계연습 2판',
  '이승우',
  2,
  '{"show_type_filters": false, "show_star_filter": false}'::jsonb
);

-- 챕터 12개
INSERT INTO public.chapters (id, book_id, title, chapter_number, display_order) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', '간접원가배분 및 활동기준원가계산', 1, 1),
  ('c2000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', '개별원가계산', 2, 2),
  ('c2000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000001', '종합원가계산', 3, 3),
  ('c2000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000001', '결합원가계산', 4, 4),
  ('c2000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000001', '전부·변동·초변동원가계산', 5, 5),
  ('c2000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000001', 'CVP분석', 6, 6),
  ('c2000000-0000-0000-0000-000000000007', 'b2000000-0000-0000-0000-000000000001', '의사결정과 관련원가', 7, 7),
  ('c2000000-0000-0000-0000-000000000008', 'b2000000-0000-0000-0000-000000000001', '표준원가', 8, 8),
  ('c2000000-0000-0000-0000-000000000009', 'b2000000-0000-0000-0000-000000000001', '판매부문·투자중심점의 성과평가', 9, 9),
  ('c2000000-0000-0000-0000-000000000010', 'b2000000-0000-0000-0000-000000000001', '사내대체거래', 10, 10),
  ('c2000000-0000-0000-0000-000000000011', 'b2000000-0000-0000-0000-000000000001', '전략적 원가관리', 11, 11),
  ('c2000000-0000-0000-0000-000000000012', 'b2000000-0000-0000-0000-000000000001', '부록', 12, 12);

-- 문항 195개
-- Ch1: 13문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000001', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 10, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 11, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 12, 'example', false),
  ('c2000000-0000-0000-0000-000000000001', 13, 'example', false);

-- Ch2: 4문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000002', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000002', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000002', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000002', 4, 'example', false);

-- Ch3: 20문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000003', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 10, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 11, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 12, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 13, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 14, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 15, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 16, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 17, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 18, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 19, 'example', false),
  ('c2000000-0000-0000-0000-000000000003', 20, 'example', false);

-- Ch4: 10문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000004', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000004', 10, 'example', false);

-- Ch5: 10문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000005', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000005', 10, 'example', false);

-- Ch6: 28문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000006', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 10, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 11, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 12, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 13, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 14, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 15, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 16, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 17, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 18, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 19, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 20, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 21, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 22, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 23, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 24, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 25, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 26, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 27, 'example', false),
  ('c2000000-0000-0000-0000-000000000006', 28, 'example', false);

-- Ch7: 30문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000007', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 10, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 11, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 12, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 13, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 14, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 15, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 16, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 17, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 18, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 19, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 20, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 21, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 22, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 23, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 24, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 25, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 26, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 27, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 28, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 29, 'example', false),
  ('c2000000-0000-0000-0000-000000000007', 30, 'example', false);

-- Ch8: 25문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000008', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 10, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 11, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 12, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 13, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 14, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 15, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 16, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 17, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 18, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 19, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 20, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 21, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 22, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 23, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 24, 'example', false),
  ('c2000000-0000-0000-0000-000000000008', 25, 'example', false);

-- Ch9: 10문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000009', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000009', 10, 'example', false);

-- Ch10: 17문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000010', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 10, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 11, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 12, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 13, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 14, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 15, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 16, 'example', false),
  ('c2000000-0000-0000-0000-000000000010', 17, 'example', false);

-- Ch11: 19문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000011', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 9, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 10, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 11, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 12, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 13, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 14, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 15, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 16, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 17, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 18, 'example', false),
  ('c2000000-0000-0000-0000-000000000011', 19, 'example', false);

-- Ch12 (부록): 9문항
INSERT INTO public.questions (chapter_id, question_number, question_type, is_essential) VALUES
  ('c2000000-0000-0000-0000-000000000012', 1, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 2, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 3, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 4, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 5, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 6, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 7, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 8, 'example', false),
  ('c2000000-0000-0000-0000-000000000012', 9, 'example', false);

-- ===== 20260328030636_7c3d098a-34ad-4b50-9108-4bcdcde933f1.sql =====

-- 1. Insert book
INSERT INTO books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'd2000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  '재무관리연습 11판',
  '김민환',
  2,
  '{"show_type_filters": false, "show_star_filter": false}'::jsonb
);

-- 2. Insert 16 chapters
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES
('d2010000-0000-0000-0000-000000000001', 'd2000000-0000-0000-0000-000000000001', '재무관리의 기초', 1, 1),
('d2010000-0000-0000-0000-000000000002', 'd2000000-0000-0000-0000-000000000001', '불확실성 하의 최적선택', 2, 2),
('d2010000-0000-0000-0000-000000000003', 'd2000000-0000-0000-0000-000000000001', '위험과 수익률의 균형관계', 3, 3),
('d2010000-0000-0000-0000-000000000004', 'd2000000-0000-0000-0000-000000000001', '가치평가의 원리', 4, 4),
('d2010000-0000-0000-0000-000000000005', 'd2000000-0000-0000-0000-000000000001', '기업가치의 평가', 5, 5),
('d2010000-0000-0000-0000-000000000006', 'd2000000-0000-0000-0000-000000000001', '투자안의 평가(자본예산)', 6, 6),
('d2010000-0000-0000-0000-000000000007', 'd2000000-0000-0000-0000-000000000001', '합병(M&A)의 평가', 7, 7),
('d2010000-0000-0000-0000-000000000008', 'd2000000-0000-0000-0000-000000000001', '리스의 평가', 8, 8),
('d2010000-0000-0000-0000-000000000009', 'd2000000-0000-0000-0000-000000000001', '채권가치평가와 채권투자전략', 9, 9),
('d2010000-0000-0000-0000-000000000010', 'd2000000-0000-0000-0000-000000000001', '주식가치의 평가', 10, 10),
('d2010000-0000-0000-0000-000000000011', 'd2000000-0000-0000-0000-000000000001', '옵션가치의 평가', 11, 11),
('d2010000-0000-0000-0000-000000000012', 'd2000000-0000-0000-0000-000000000001', '옵션의 응용', 12, 12),
('d2010000-0000-0000-0000-000000000013', 'd2000000-0000-0000-0000-000000000001', '선물가격의 결정', 13, 13),
('d2010000-0000-0000-0000-000000000014', 'd2000000-0000-0000-0000-000000000001', '환율의 결정과 국제자본예산', 14, 14),
('d2010000-0000-0000-0000-000000000015', 'd2000000-0000-0000-0000-000000000001', '스왑의 평가', 15, 15),
('d2010000-0000-0000-0000-000000000016', 'd2000000-0000-0000-0000-000000000001', '위험관리', 16, 16);

-- 3. Insert questions (434 total)
-- Ch1: 17 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential) VALUES
('d2010000-0000-0000-0000-000000000001', 1, 'example', false),
('d2010000-0000-0000-0000-000000000001', 2, 'example', false),
('d2010000-0000-0000-0000-000000000001', 3, 'example', false),
('d2010000-0000-0000-0000-000000000001', 4, 'example', false),
('d2010000-0000-0000-0000-000000000001', 5, 'example', false),
('d2010000-0000-0000-0000-000000000001', 6, 'example', false),
('d2010000-0000-0000-0000-000000000001', 7, 'example', false),
('d2010000-0000-0000-0000-000000000001', 8, 'example', false),
('d2010000-0000-0000-0000-000000000001', 9, 'example', false),
('d2010000-0000-0000-0000-000000000001', 10, 'example', false),
('d2010000-0000-0000-0000-000000000001', 11, 'example', false),
('d2010000-0000-0000-0000-000000000001', 12, 'example', false),
('d2010000-0000-0000-0000-000000000001', 13, 'example', false),
('d2010000-0000-0000-0000-000000000001', 14, 'example', false),
('d2010000-0000-0000-0000-000000000001', 15, 'example', false),
('d2010000-0000-0000-0000-000000000001', 16, 'example', false),
('d2010000-0000-0000-0000-000000000001', 17, 'example', false);

-- Ch2: 37 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000002', generate_series(1, 37), 'example', false;

-- Ch3: 37 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000003', generate_series(1, 37), 'example', false;

-- Ch4: 11 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000004', generate_series(1, 11), 'example', false;

-- Ch5: 55 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000005', generate_series(1, 55), 'example', false;

-- Ch6: 48 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000006', generate_series(1, 48), 'example', false;

-- Ch7: 21 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000007', generate_series(1, 21), 'example', false;

-- Ch8: 3 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000008', generate_series(1, 3), 'example', false;

-- Ch9: 46 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000009', generate_series(1, 46), 'example', false;

-- Ch10: 9 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000010', generate_series(1, 9), 'example', false;

-- Ch11: 42 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000011', generate_series(1, 42), 'example', false;

-- Ch12: 36 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000012', generate_series(1, 36), 'example', false;

-- Ch13: 20 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000013', generate_series(1, 20), 'example', false;

-- Ch14: 11 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000014', generate_series(1, 11), 'example', false;

-- Ch15: 6 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000015', generate_series(1, 6), 'example', false;

-- Ch16: 35 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000016', generate_series(1, 35), 'example', false;

-- ===== 20260328031159_75e7b86d-3ab3-4bfa-95f8-f719813b9b9a.sql =====

-- 1. 중급회계연습 - 김영덕 (1권, 19챕터, 189문항)
INSERT INTO books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'e1000000-0000-0000-0000-000000000001',
  '97de4fc8-e472-4ef3-ab9a-fba00a87b405',
  '중급회계연습 - 김영덕',
  '김영덕',
  2,
  '{"show_type_filters": false, "show_star_filter": false}'::jsonb
);

INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES
('e1010000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', '수익', 1, 1),
('e1010000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', '건설계약', 2, 2),
('e1010000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', '현금흐름표', 3, 3),
('e1010000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000001', '재고자산과 농림어업', 4, 4),
('e1010000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000001', '유형자산', 5, 5),
('e1010000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000001', '차입원가', 6, 6),
('e1010000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000001', '무형자산', 7, 7),
('e1010000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000001', '금융부채', 8, 8),
('e1010000-0000-0000-0000-000000000009', 'e1000000-0000-0000-0000-000000000001', '충당부채와 보고기간후 사건', 9, 9),
('e1010000-0000-0000-0000-000000000010', 'e1000000-0000-0000-0000-000000000001', '자본', 10, 10),
('e1010000-0000-0000-0000-000000000011', 'e1000000-0000-0000-0000-000000000001', '금융자산', 11, 11),
('e1010000-0000-0000-0000-000000000012', 'e1000000-0000-0000-0000-000000000001', '복합금융상품', 12, 12),
('e1010000-0000-0000-0000-000000000013', 'e1000000-0000-0000-0000-000000000001', '종업원급여', 13, 13),
('e1010000-0000-0000-0000-000000000014', 'e1000000-0000-0000-0000-000000000001', '주식기준보상', 14, 14),
('e1010000-0000-0000-0000-000000000015', 'e1000000-0000-0000-0000-000000000001', '리스회계', 15, 15),
('e1010000-0000-0000-0000-000000000016', 'e1000000-0000-0000-0000-000000000001', '투자부동산과 매각예정비유동자산', 16, 16),
('e1010000-0000-0000-0000-000000000017', 'e1000000-0000-0000-0000-000000000001', '법인세회계', 17, 17),
('e1010000-0000-0000-0000-000000000018', 'e1000000-0000-0000-0000-000000000001', '회계변경과 오류수정', 18, 18),
('e1010000-0000-0000-0000-000000000019', 'e1000000-0000-0000-0000-000000000001', '주당이익', 19, 19);

-- 중급 문항 삽입 (ch1:19, ch2:6, ch3:14, ch4:9, ch5:13, ch6:4, ch7:6, ch8:6, ch9:8, ch10:7, ch11:12, ch12:9, ch13:5, ch14:13, ch15:16, ch16:6, ch17:11, ch18:17, ch19:8)
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000001', generate_series(1,19), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000002', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000003', generate_series(1,14), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000004', generate_series(1,9), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000005', generate_series(1,13), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000006', generate_series(1,4), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000007', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000008', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000009', generate_series(1,8), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000010', generate_series(1,7), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000011', generate_series(1,12), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000012', generate_series(1,9), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000013', generate_series(1,5), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000014', generate_series(1,13), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000015', generate_series(1,16), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000016', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000017', generate_series(1,11), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000018', generate_series(1,17), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000019', generate_series(1,8), 'example', false;

-- 2. 고급회계연습 - 김영덕 (5챕터, 97문항)
INSERT INTO books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'e2000000-0000-0000-0000-000000000001',
  'ca2c6188-1861-4428-a7f7-38f2b4b75cec',
  '고급회계연습 - 김영덕',
  '김영덕',
  2,
  '{"show_type_filters": false, "show_star_filter": false}'::jsonb
);

INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES
('e2010000-0000-0000-0000-000000000001', 'e2000000-0000-0000-0000-000000000001', '사업결합', 1, 1),
('e2010000-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000001', '관계기업과 공동기업 투자', 2, 2),
('e2010000-0000-0000-0000-000000000003', 'e2000000-0000-0000-0000-000000000001', '연결회계', 3, 3),
('e2010000-0000-0000-0000-000000000004', 'e2000000-0000-0000-0000-000000000001', '환율변동효과', 4, 4),
('e2010000-0000-0000-0000-000000000005', 'e2000000-0000-0000-0000-000000000001', '파생상품', 5, 5);

INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000001', generate_series(1,17), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000002', generate_series(1,11), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000003', generate_series(1,38), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000004', generate_series(1,14), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000005', generate_series(1,17), 'example', false;
