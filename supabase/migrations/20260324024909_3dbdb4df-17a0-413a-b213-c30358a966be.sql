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