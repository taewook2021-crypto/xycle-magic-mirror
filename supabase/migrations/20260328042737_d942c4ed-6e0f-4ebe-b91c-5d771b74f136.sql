-- Update 김영덕 중급회계연습 유예 questions to practice type
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000001' AND question_number > 13;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000002' AND question_number > 4;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000003' AND question_number > 10;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000004' AND question_number > 9;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000005' AND question_number > 11;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000006' AND question_number > 2;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000007' AND question_number > 4;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000008' AND question_number > 5;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000009' AND question_number > 7;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000010' AND question_number > 7;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000011' AND question_number > 9;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000012' AND question_number > 6;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000013' AND question_number > 5;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000014' AND question_number > 9;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000015' AND question_number > 12;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000016' AND question_number > 3;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000017' AND question_number > 7;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000018' AND question_number > 14;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e1010000-0000-0000-0000-000000000019' AND question_number > 5;

-- Update 김영덕 고급회계연습 유예 questions to practice type
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e2010000-0000-0000-0000-000000000001' AND question_number > 14;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e2010000-0000-0000-0000-000000000002' AND question_number > 9;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e2010000-0000-0000-0000-000000000003' AND question_number > 29;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e2010000-0000-0000-0000-000000000004' AND question_number > 11;
UPDATE questions SET question_type = 'practice' WHERE chapter_id = 'e2010000-0000-0000-0000-000000000005' AND question_number > 11;

-- Update filter_config for both books
UPDATE books SET filter_config = '{"show_type_filters": true, "show_star_filter": false, "show_essential_filter": false, "show_exam_year_column": false, "type_labels": {"example": "기본", "practice": "유예"}}'::jsonb WHERE id = 'e1000000-0000-0000-0000-000000000001';
UPDATE books SET filter_config = '{"show_type_filters": true, "show_star_filter": false, "show_essential_filter": false, "show_exam_year_column": false, "type_labels": {"example": "기본", "practice": "유예"}}'::jsonb WHERE id = 'e2000000-0000-0000-0000-000000000001';