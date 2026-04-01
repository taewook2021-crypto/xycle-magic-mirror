-- Shift existing practice questions 11→12, 12→13, ... 20→21 (reverse order to avoid conflicts)
UPDATE public.questions SET question_number = 21 WHERE id = '4fa7ec6d-419b-5fdc-9520-f832b3cb0751';
UPDATE public.questions SET question_number = 20 WHERE id = '0bbaa915-d202-52f3-b967-00740b9d822a';
UPDATE public.questions SET question_number = 19 WHERE id = 'b5b4d43b-ed02-5fc6-9e6e-c3fb79e2cfa3';
UPDATE public.questions SET question_number = 18 WHERE id = '74c0033c-01f8-59f6-8d3b-c7fc7985c29e';
UPDATE public.questions SET question_number = 17 WHERE id = '76e5acd6-a650-5b6a-9d39-236385eb810c';
UPDATE public.questions SET question_number = 16 WHERE id = 'dc28ed67-6f99-5f2e-9b64-bd94d3508694';
UPDATE public.questions SET question_number = 15 WHERE id = '4253ca7a-7aa8-5dc0-baa7-bc41ad9560a1';
UPDATE public.questions SET question_number = 14 WHERE id = 'ed913cb8-d4d2-5f3f-a6f8-837edfa2cebe';
UPDATE public.questions SET question_number = 13 WHERE id = 'd62fd35f-79fa-5b3e-89f6-f9f6fa8c6d76';
UPDATE public.questions SET question_number = 12 WHERE id = 'e09ad91f-8598-5735-be1f-565fefe4947c';

-- Insert new practice question 11
INSERT INTO public.questions (chapter_id, question_number, question_type, topic)
VALUES ('bf5f9234-22f8-520f-8988-16cd9a9f3879', 11, 'practice', '취득일이 다른 단계적 소유');