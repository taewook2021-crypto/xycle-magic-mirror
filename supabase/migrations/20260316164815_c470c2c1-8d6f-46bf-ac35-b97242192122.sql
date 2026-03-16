-- Add round number and result text to attempts
ALTER TABLE public.attempts
  ADD COLUMN round integer NOT NULL DEFAULT 1,
  ADD COLUMN result text NOT NULL DEFAULT 'correct';

-- Allow upsert by (user_id, question_id, round)
ALTER TABLE public.attempts
  ADD CONSTRAINT attempts_user_question_round_unique UNIQUE (user_id, question_id, round);

-- Make student_answer nullable (we use result instead)
ALTER TABLE public.attempts
  ALTER COLUMN student_answer DROP NOT NULL,
  ALTER COLUMN student_answer SET DEFAULT 0;

-- Allow users to update and delete their own attempts
CREATE POLICY "Users can update own attempts" ON public.attempts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own attempts" ON public.attempts
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());