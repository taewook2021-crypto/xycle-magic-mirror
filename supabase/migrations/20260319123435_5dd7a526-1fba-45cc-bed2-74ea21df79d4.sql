
-- follows table for social features
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can see follows
CREATE POLICY "Authenticated can read follows"
ON public.follows FOR SELECT TO authenticated
USING (true);

-- Users can insert own follows
CREATE POLICY "Users can follow others"
ON public.follows FOR INSERT TO authenticated
WITH CHECK (follower_id = auth.uid());

-- Users can unfollow
CREATE POLICY "Users can unfollow"
ON public.follows FOR DELETE TO authenticated
USING (follower_id = auth.uid());

-- Also need to allow authenticated users to read ALL attempts for ranking
-- Currently attempts RLS only allows own reads. We need a new policy for public ranking.
CREATE POLICY "Public users attempts readable for ranking"
ON public.attempts FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = attempts.user_id
    AND profiles.is_public = true
  )
);
