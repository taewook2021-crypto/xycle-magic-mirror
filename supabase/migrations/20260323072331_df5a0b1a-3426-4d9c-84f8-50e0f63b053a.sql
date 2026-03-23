-- Delete all related data for 김한솔 books
-- 1. Delete attempts for questions in these books' chapters
DELETE FROM attempts WHERE question_id IN (
  SELECT q.id FROM questions q
  JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('ed6bbc9f-c3e2-4acc-8680-771f29acc354', 'd7ce6d0d-9236-48cf-9584-b2a0db4753f2')
);

-- 2. Delete user_question_skips
DELETE FROM user_question_skips WHERE question_id IN (
  SELECT q.id FROM questions q
  JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('ed6bbc9f-c3e2-4acc-8680-771f29acc354', 'd7ce6d0d-9236-48cf-9584-b2a0db4753f2')
);

-- 3. Delete user_question_memos
DELETE FROM user_question_memos WHERE question_id IN (
  SELECT q.id FROM questions q
  JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('ed6bbc9f-c3e2-4acc-8680-771f29acc354', 'd7ce6d0d-9236-48cf-9584-b2a0db4753f2')
);

-- 4. Delete questions
DELETE FROM questions WHERE chapter_id IN (
  SELECT id FROM chapters WHERE book_id IN ('ed6bbc9f-c3e2-4acc-8680-771f29acc354', 'd7ce6d0d-9236-48cf-9584-b2a0db4753f2')
);

-- 5. Delete chapters
DELETE FROM chapters WHERE book_id IN ('ed6bbc9f-c3e2-4acc-8680-771f29acc354', 'd7ce6d0d-9236-48cf-9584-b2a0db4753f2');

-- 6. Delete user_books registrations
DELETE FROM user_books WHERE book_id IN ('ed6bbc9f-c3e2-4acc-8680-771f29acc354', 'd7ce6d0d-9236-48cf-9584-b2a0db4753f2');

-- 7. Delete the books
DELETE FROM books WHERE id IN ('ed6bbc9f-c3e2-4acc-8680-771f29acc354', 'd7ce6d0d-9236-48cf-9584-b2a0db4753f2');