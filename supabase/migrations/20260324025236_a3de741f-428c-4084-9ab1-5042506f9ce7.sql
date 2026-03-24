-- Allow any authenticated user to find a group by invite_code (for joining)
CREATE POLICY "Anyone can find group by invite code"
  ON public.study_groups FOR SELECT TO authenticated
  USING (true);