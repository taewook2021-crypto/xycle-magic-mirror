-- Add display_order column to user_books
ALTER TABLE user_books ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Allow users to update their own user_books (for reordering)
CREATE POLICY "Users can update own books"
ON user_books
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());