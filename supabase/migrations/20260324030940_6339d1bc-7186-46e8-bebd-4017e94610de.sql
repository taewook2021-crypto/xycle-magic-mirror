
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
