
-- user_books: 학생의 교재 구독
CREATE TABLE IF NOT EXISTS public.user_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own books" ON public.user_books FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own books" ON public.user_books FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own books" ON public.user_books FOR DELETE TO authenticated USING (user_id = auth.uid());
