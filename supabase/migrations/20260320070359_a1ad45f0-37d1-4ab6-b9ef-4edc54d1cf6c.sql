INSERT INTO questions (id, chapter_id, question_number, question_type, topic, exam_year, is_essential, correct_answer) SELECT * FROM (VALUES
('7d960416-dad3-55a9-8f4d-a3a770911170'::uuid, '68a27164-6518-5a57-890a-f6a7dc93d0ed'::uuid, 1, 'example', '회계의 정의', NULL::text, false, NULL::int),
('f16a3220-5f19-517a-8516-ca2d4610e7aa'::uuid, '68a27164-6518-5a57-890a-f6a7dc93d0ed'::uuid, 2, 'example', '회계의 사회적 기능', NULL, false, NULL),
('e69f9bb9-549c-5ec5-ac7e-f3fe806c189b'::uuid, '68a27164-6518-5a57-890a-f6a7dc93d0ed'::uuid, 3, 'example', 'GAAP과 K-IFRS', NULL, false, NULL)
) AS t(id, chapter_id, question_number, question_type, topic, exam_year, is_essential, correct_answer)
WHERE false;