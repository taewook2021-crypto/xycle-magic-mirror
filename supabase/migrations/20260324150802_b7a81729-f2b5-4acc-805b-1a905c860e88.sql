-- Admin can read all profiles
CREATE POLICY "Admin can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read all user_books
CREATE POLICY "Admin can read all user_books"
ON public.user_books
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read all attempts
CREATE POLICY "Admin can read all attempts"
ON public.attempts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));