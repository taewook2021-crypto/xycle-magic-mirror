
-- 문항에 예제/기출/실전 구분 컬럼 추가
ALTER TABLE public.questions ADD COLUMN question_type text NOT NULL DEFAULT 'example';
COMMENT ON COLUMN public.questions.question_type IS 'example | past_exam | practice';
