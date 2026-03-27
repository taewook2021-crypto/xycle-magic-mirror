-- 정우승 교재 2권 및 관련 데이터 삭제
DELETE FROM attempts WHERE question_id IN (
  SELECT q.id FROM questions q JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM user_question_memos WHERE question_id IN (
  SELECT q.id FROM questions q JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM user_question_skips WHERE question_id IN (
  SELECT q.id FROM questions q JOIN chapters c ON q.chapter_id = c.id
  WHERE c.book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM questions WHERE chapter_id IN (
  SELECT id FROM chapters WHERE book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415')
);
DELETE FROM chapters WHERE book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415');
DELETE FROM user_books WHERE book_id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415');
DELETE FROM books WHERE id IN ('2405510a-272e-4508-8a1b-8662a04c6c38', '4ae3260a-ba92-4d34-8110-3242754b3415');