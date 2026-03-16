
-- 1. 기출 문항 태깅 (book d1...002의 챕터에 속한 문항)
UPDATE public.questions SET question_type = 'past_exam'
WHERE chapter_id IN (SELECT id FROM public.chapters WHERE book_id = 'd1000000-0000-0000-0000-000000000002');

-- 2. 실전 문항 태깅 (book d1...003의 챕터에 속한 문항)
UPDATE public.questions SET question_type = 'practice'
WHERE chapter_id IN (SELECT id FROM public.chapters WHERE book_id = 'd1000000-0000-0000-0000-000000000003');

-- 3. 기출 문항의 chapter_id를 예제 챕터로 이동 (2XX → 1XX)
UPDATE public.questions q SET chapter_id = (
  SELECT ec.id FROM public.chapters ec
  WHERE ec.book_id = 'd1000000-0000-0000-0000-000000000001'
    AND ec.chapter_number = (SELECT kc.chapter_number FROM public.chapters kc WHERE kc.id = q.chapter_id)
)
WHERE chapter_id IN (SELECT id FROM public.chapters WHERE book_id = 'd1000000-0000-0000-0000-000000000002');

-- 4. 실전 문항의 chapter_id를 예제 챕터로 이동 (3XX → 1XX)
UPDATE public.questions q SET chapter_id = (
  SELECT ec.id FROM public.chapters ec
  WHERE ec.book_id = 'd1000000-0000-0000-0000-000000000001'
    AND ec.chapter_number = (SELECT sc.chapter_number FROM public.chapters sc WHERE sc.id = q.chapter_id)
)
WHERE chapter_id IN (SELECT id FROM public.chapters WHERE book_id = 'd1000000-0000-0000-0000-000000000003');

-- 5. 기출/실전 챕터 삭제
DELETE FROM public.chapters WHERE book_id IN ('d1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003');

-- 6. 기출/실전 교재 삭제
DELETE FROM public.books WHERE id IN ('d1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003');

-- 7. 남은 교재 이름 변경
UPDATE public.books SET title = '재무관리', display_order = 1 WHERE id = 'd1000000-0000-0000-0000-000000000001';

-- 8. 중급회계 데이터 삭제 (문항 → 챕터 → 교재 → 소주제 → 대단원 → 과목)
DELETE FROM public.questions WHERE chapter_id IN (
  SELECT c.id FROM public.chapters c JOIN public.books b ON c.book_id = b.id WHERE b.subject_id = 'a0000000-0000-0000-0000-000000000001'
);
DELETE FROM public.chapters WHERE book_id IN (
  SELECT id FROM public.books WHERE subject_id = 'a0000000-0000-0000-0000-000000000001'
);
DELETE FROM public.books WHERE subject_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM public.sub_topics WHERE topic_id IN (
  SELECT id FROM public.topics WHERE subject_id = 'a0000000-0000-0000-0000-000000000001'
);
DELETE FROM public.topics WHERE subject_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM public.subjects WHERE id = 'a0000000-0000-0000-0000-000000000001';
