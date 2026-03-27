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