CREATE POLICY "Public user books readable"
ON public.user_books FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE profiles.id = user_books.user_id
  AND profiles.is_public = true
));