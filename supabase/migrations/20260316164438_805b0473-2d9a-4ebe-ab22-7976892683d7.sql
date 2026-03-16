CREATE TABLE public.user_question_skips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE public.user_question_skips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own skips" ON public.user_question_skips
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own skips" ON public.user_question_skips
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own skips" ON public.user_question_skips
  FOR DELETE TO authenticated USING (user_id = auth.uid());