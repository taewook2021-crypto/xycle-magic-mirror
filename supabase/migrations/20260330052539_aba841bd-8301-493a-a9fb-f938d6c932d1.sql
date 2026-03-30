
-- Add is_public and description columns to study_groups
ALTER TABLE public.study_groups
  ADD COLUMN is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN description text;

-- Add RLS policy: anyone authenticated can see public groups
CREATE POLICY "Public groups readable by all"
  ON public.study_groups
  FOR SELECT
  TO authenticated
  USING (is_public = true);
