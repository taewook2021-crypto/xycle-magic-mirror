-- ===== 20260328043318_921b1796-6153-4abe-a9c3-668898c8b3c3.sql =====
-- 이승우 원가관리회계연습 2판: 중요도 A/B/C 메타데이터 업데이트
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000001' AND question_number <= 5;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000001' AND question_number > 5 AND question_number <= 9;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000001' AND question_number > 9;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000002' AND question_number <= 1;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000002' AND question_number > 1 AND question_number <= 3;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000002' AND question_number > 3;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000003' AND question_number <= 7;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000003' AND question_number > 7 AND question_number <= 13;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000003' AND question_number > 13;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000004' AND question_number <= 5;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000004' AND question_number > 5 AND question_number <= 8;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000004' AND question_number > 8;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000005' AND question_number <= 4;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000005' AND question_number > 4 AND question_number <= 8;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000005' AND question_number > 8;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000006' AND question_number <= 12;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000006' AND question_number > 12 AND question_number <= 20;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000006' AND question_number > 20;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000007' AND question_number <= 11;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000007' AND question_number > 11 AND question_number <= 21;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000007' AND question_number > 21;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000008' AND question_number <= 10;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000008' AND question_number > 10 AND question_number <= 18;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000008' AND question_number > 18;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000009' AND question_number <= 4;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000009' AND question_number > 4 AND question_number <= 8;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000009' AND question_number > 8;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000010' AND question_number <= 7;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000010' AND question_number > 7 AND question_number <= 13;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000010' AND question_number > 13;
UPDATE questions SET question_type='example', topic='A' WHERE chapter_id='c2000000-0000-0000-0000-000000000011' AND question_number <= 7;
UPDATE questions SET question_type='past_exam', topic='B' WHERE chapter_id='c2000000-0000-0000-0000-000000000011' AND question_number > 7 AND question_number <= 13;
UPDATE questions SET question_type='practice', topic='C' WHERE chapter_id='c2000000-0000-0000-0000-000000000011' AND question_number > 13;
UPDATE questions SET question_type='example', topic=NULL WHERE chapter_id='c2000000-0000-0000-0000-000000000012';
UPDATE books SET filter_config = '{"show_type_filters": true, "show_star_filter": false, "show_essential_filter": false, "show_exam_year_column": false, "type_labels": {"example": "A", "past_exam": "B", "practice": "C"}}'::jsonb WHERE id = 'b2000000-0000-0000-0000-000000000001';

-- ===== 20260328043944_c88c594d-a5f4-47b4-a69d-d92b6c147c33.sql =====
-- 김민환 재무관리연습 11판: 예제/필수/보충 분류
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000001' AND question_number <= 7;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000001' AND question_number > 7 AND question_number <= 12;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000001' AND question_number > 12;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000002' AND question_number <= 7;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000002' AND question_number > 7 AND question_number <= 31;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000002' AND question_number > 31;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000003' AND question_number <= 7;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000003' AND question_number > 7 AND question_number <= 35;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000003' AND question_number > 35;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000004' AND question_number <= 5;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000004' AND question_number > 5 AND question_number <= 11;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000005' AND question_number <= 10;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000005' AND question_number > 10 AND question_number <= 47;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000005' AND question_number > 47;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000006' AND question_number <= 12;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000006' AND question_number > 12 AND question_number <= 43;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000006' AND question_number > 43;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000007' AND question_number <= 5;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000007' AND question_number > 5 AND question_number <= 20;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000007' AND question_number > 20;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000008' AND question_number <= 2;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000008' AND question_number > 2;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000009' AND question_number <= 8;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000009' AND question_number > 8 AND question_number <= 41;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000009' AND question_number > 41;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000010' AND question_number <= 7;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000010' AND question_number > 7;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000011' AND question_number <= 8;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000011' AND question_number > 8 AND question_number <= 41;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000011' AND question_number > 41;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000012' AND question_number <= 6;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000012' AND question_number > 6 AND question_number <= 29;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000012' AND question_number > 29;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000013' AND question_number <= 6;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000013' AND question_number > 6 AND question_number <= 18;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000013' AND question_number > 18;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000014' AND question_number <= 3;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000014' AND question_number > 3 AND question_number <= 11;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000015' AND question_number <= 6;
UPDATE questions SET question_type='example' WHERE chapter_id='d2010000-0000-0000-0000-000000000016' AND question_number <= 12;
UPDATE questions SET question_type='past_exam' WHERE chapter_id='d2010000-0000-0000-0000-000000000016' AND question_number > 12 AND question_number <= 32;
UPDATE questions SET question_type='practice' WHERE chapter_id='d2010000-0000-0000-0000-000000000016' AND question_number > 32;
-- Update filter_config
UPDATE books SET filter_config = '{"show_type_filters": true, "show_star_filter": false, "show_essential_filter": false, "show_exam_year_column": false, "type_labels": {"example": "예제", "past_exam": "필수", "practice": "보충"}}'::jsonb WHERE id = 'd2000000-0000-0000-0000-000000000001';

-- ===== 20260328044737_0ed3b62c-f5ff-47d4-a5f6-c32b1283821a.sql =====
-- Update topic with classification for 이승철 세무회계연습 (488 questions)
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '036eca61-4147-570a-8515-559a26f2afba' AND question_number IN (3,7,15);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '036eca61-4147-570a-8515-559a26f2afba' AND question_number IN (1,2,4,5,6,12,14,16,17);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '036eca61-4147-570a-8515-559a26f2afba' AND question_number IN (8,9,10,13,18);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '036eca61-4147-570a-8515-559a26f2afba' AND question_number IN (11,19,20);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '05ca9ead-4655-5d0d-ad35-63bbeb41d2c5' AND question_number IN (1,12,13,17);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '05ca9ead-4655-5d0d-ad35-63bbeb41d2c5' AND question_number IN (6,7,8,14,15,16,24);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '05ca9ead-4655-5d0d-ad35-63bbeb41d2c5' AND question_number IN (2,3,9,18,19,20,21,23,25,26,27,28);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = '05ca9ead-4655-5d0d-ad35-63bbeb41d2c5' AND question_number IN (5,31);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '05ca9ead-4655-5d0d-ad35-63bbeb41d2c5' AND question_number IN (4,10,11,22,29,30);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '13bcf71f-6dae-5f4e-8a60-2f8d96eddcc3' AND question_number IN (4,15);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '13bcf71f-6dae-5f4e-8a60-2f8d96eddcc3' AND question_number IN (1,2,3,10,11,13,17,18,19);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '13bcf71f-6dae-5f4e-8a60-2f8d96eddcc3' AND question_number IN (5,6,7,8,12,14,16,20,21,22);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = '13bcf71f-6dae-5f4e-8a60-2f8d96eddcc3' AND question_number IN (24);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '13bcf71f-6dae-5f4e-8a60-2f8d96eddcc3' AND question_number IN (9,23);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '1420260b-aa8a-50f6-a93f-39f677c6f236' AND question_number IN (8,21,31);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '1420260b-aa8a-50f6-a93f-39f677c6f236' AND question_number IN (1,2,3,4,5,7,9,12,13,14,22,32,35);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = '1420260b-aa8a-50f6-a93f-39f677c6f236' AND question_number IN (27);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '1420260b-aa8a-50f6-a93f-39f677c6f236' AND question_number IN (6,10,11,15,16,17,18,23,24,25,26,28,29,33,34,36);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '1420260b-aa8a-50f6-a93f-39f677c6f236' AND question_number IN (19,20,30);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '1538772e-a8a8-5084-88c0-b73d773ea6a4' AND question_number IN (18);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '1538772e-a8a8-5084-88c0-b73d773ea6a4' AND question_number IN (1,2,3,5,9,10,12,15,16,17,22,23,28);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = '1538772e-a8a8-5084-88c0-b73d773ea6a4' AND question_number IN (25);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '1538772e-a8a8-5084-88c0-b73d773ea6a4' AND question_number IN (4,6,7,11,13,19,20,21,24,29);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '1538772e-a8a8-5084-88c0-b73d773ea6a4' AND question_number IN (8,14,26,27);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '1576d96a-8fbe-5c66-918b-bcf308328992' AND question_number IN (3);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '1576d96a-8fbe-5c66-918b-bcf308328992' AND question_number IN (1,2,4);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '1576d96a-8fbe-5c66-918b-bcf308328992' AND question_number IN (5);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '21f6d4e7-54bb-529f-b462-4ce67a0adb91' AND question_number IN (3,9,10,23);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '21f6d4e7-54bb-529f-b462-4ce67a0adb91' AND question_number IN (1,2,6,8,16,17,18,22);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = '21f6d4e7-54bb-529f-b462-4ce67a0adb91' AND question_number IN (15,20);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '21f6d4e7-54bb-529f-b462-4ce67a0adb91' AND question_number IN (4,7,11,12,14,19,21);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '21f6d4e7-54bb-529f-b462-4ce67a0adb91' AND question_number IN (5,13);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '31f2215d-a815-5815-b983-0b1238a9f53a' AND question_number IN (1,2,3,4,6,7,8,9,12,13,14);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = '31f2215d-a815-5815-b983-0b1238a9f53a' AND question_number IN (11);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '31f2215d-a815-5815-b983-0b1238a9f53a' AND question_number IN (5,10);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '35282487-6b21-5c43-a728-3b0eeaa264ab' AND question_number IN (5,9,14,15);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '35282487-6b21-5c43-a728-3b0eeaa264ab' AND question_number IN (1,2,6);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '35282487-6b21-5c43-a728-3b0eeaa264ab' AND question_number IN (3,4,7,10,16,17,18,19);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = '35282487-6b21-5c43-a728-3b0eeaa264ab' AND question_number IN (13);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '35282487-6b21-5c43-a728-3b0eeaa264ab' AND question_number IN (8,11,12,20);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '6ac4d9fe-9233-5bb7-b255-c0e667336c06' AND question_number IN (2,14,15);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = '6ac4d9fe-9233-5bb7-b255-c0e667336c06' AND question_number IN (1);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '6ac4d9fe-9233-5bb7-b255-c0e667336c06' AND question_number IN (3,4,5,6,7,8,9,10,11,12,13,16,17,18,21,22,23,24,25,27);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = '6ac4d9fe-9233-5bb7-b255-c0e667336c06' AND question_number IN (28);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '6ac4d9fe-9233-5bb7-b255-c0e667336c06' AND question_number IN (19,20,26);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '6f2e9492-685e-584d-8e1c-683caa97fc1b' AND question_number IN (1,2);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '6f2e9492-685e-584d-8e1c-683caa97fc1b' AND question_number IN (3,4,7);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '6f2e9492-685e-584d-8e1c-683caa97fc1b' AND question_number IN (5,6,8,9,10,11,12);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '78e7c1b1-cceb-5292-a57e-8e953303c713' AND question_number IN (1,13);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '78e7c1b1-cceb-5292-a57e-8e953303c713' AND question_number IN (5,6,7,8,18);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '78e7c1b1-cceb-5292-a57e-8e953303c713' AND question_number IN (2,3,9,10,11,12,14,15,16,17,19,20);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '78e7c1b1-cceb-5292-a57e-8e953303c713' AND question_number IN (4,21);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '83a1b9c9-aaaf-5729-b1a6-472953bc86fd' AND question_number IN (1);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '83a1b9c9-aaaf-5729-b1a6-472953bc86fd' AND question_number IN (2);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = '83a1b9c9-aaaf-5729-b1a6-472953bc86fd' AND question_number IN (7);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '83a1b9c9-aaaf-5729-b1a6-472953bc86fd' AND question_number IN (3,4,5);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = '83a1b9c9-aaaf-5729-b1a6-472953bc86fd' AND question_number IN (8,9,10);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '83a1b9c9-aaaf-5729-b1a6-472953bc86fd' AND question_number IN (6);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = '867a6d7e-3b5a-584e-9dc2-bb6d82abcf97' AND question_number IN (1,4);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '867a6d7e-3b5a-584e-9dc2-bb6d82abcf97' AND question_number IN (2,3,5);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '867a6d7e-3b5a-584e-9dc2-bb6d82abcf97' AND question_number IN (6);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '867a6d7e-3b5a-584e-9dc2-bb6d82abcf97' AND question_number IN (7);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '9345ae79-007b-53fe-93a0-3a954b9b467c' AND question_number IN (1,2);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '9345ae79-007b-53fe-93a0-3a954b9b467c' AND question_number IN (3,5);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = '9345ae79-007b-53fe-93a0-3a954b9b467c' AND question_number IN (4);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = '9b109c99-30eb-56e3-a26f-a934e3dbc458' AND question_number IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = '9b109c99-30eb-56e3-a26f-a934e3dbc458' AND question_number IN (15,16,17,18,19,20,21,22,23,24,25,26,27,28,29);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'a871d798-64dd-5877-8f34-62863c4a59d2' AND question_number IN (11);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'a871d798-64dd-5877-8f34-62863c4a59d2' AND question_number IN (1,2,3,4,6,7,8,9);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = 'a871d798-64dd-5877-8f34-62863c4a59d2' AND question_number IN (10);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'a871d798-64dd-5877-8f34-62863c4a59d2' AND question_number IN (5,12);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = 'b7f45207-23fb-5666-97cc-1a934005b8b3' AND question_number IN (1);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'b7f45207-23fb-5666-97cc-1a934005b8b3' AND question_number IN (2,3);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'b7f45207-23fb-5666-97cc-1a934005b8b3' AND question_number IN (4,5,6,7);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = 'bfd5dc85-696e-58df-8dbb-c89e10a05f0a' AND question_number IN (10);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'bfd5dc85-696e-58df-8dbb-c89e10a05f0a' AND question_number IN (1);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = 'bfd5dc85-696e-58df-8dbb-c89e10a05f0a' AND question_number IN (18);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'bfd5dc85-696e-58df-8dbb-c89e10a05f0a' AND question_number IN (2,3,4,5,6,7,8,9,11,12,13,15,16);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = 'bfd5dc85-696e-58df-8dbb-c89e10a05f0a' AND question_number IN (19);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'bfd5dc85-696e-58df-8dbb-c89e10a05f0a' AND question_number IN (14,17);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'c1e99341-c3c9-5594-a4e9-19bcaef029b2' AND question_number IN (1);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = 'c1e99341-c3c9-5594-a4e9-19bcaef029b2' AND question_number IN (2,3);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = 'c44e3001-3a10-5252-82d8-6186ea87dcd0' AND question_number IN (11,14);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'c44e3001-3a10-5252-82d8-6186ea87dcd0' AND question_number IN (1,2,3,6,7,9,15,17,23,30);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = 'c44e3001-3a10-5252-82d8-6186ea87dcd0' AND question_number IN (8);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'c44e3001-3a10-5252-82d8-6186ea87dcd0' AND question_number IN (4,5,10,12,13,16,18,19,20,21,22,24,25,26,27);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'c44e3001-3a10-5252-82d8-6186ea87dcd0' AND question_number IN (28,29);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'c6ed3d52-6eed-56c6-869f-bf4a63b70ba1' AND question_number IN (1,2,3,4,5,6,7,8);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'cf0696d3-fc9c-5714-85e0-3f363b8880bd' AND question_number IN (2,3,5);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = 'cf0696d3-fc9c-5714-85e0-3f363b8880bd' AND question_number IN (9);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'cf0696d3-fc9c-5714-85e0-3f363b8880bd' AND question_number IN (1,4,6,7,8,10,11,12);
UPDATE questions SET topic = '유예', is_essential = false WHERE chapter_id = 'cf0696d3-fc9c-5714-85e0-3f363b8880bd' AND question_number IN (14,15);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'cf0696d3-fc9c-5714-85e0-3f363b8880bd' AND question_number IN (13);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = 'd7828835-66fe-5355-a4f2-e36ccb6b5f5d' AND question_number IN (11);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'd7828835-66fe-5355-a4f2-e36ccb6b5f5d' AND question_number IN (1,2,3,4,5,6,7,8);
UPDATE questions SET topic = '동차', is_essential = false WHERE chapter_id = 'd7828835-66fe-5355-a4f2-e36ccb6b5f5d' AND question_number IN (12);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'd7828835-66fe-5355-a4f2-e36ccb6b5f5d' AND question_number IN (9,10,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'd7828835-66fe-5355-a4f2-e36ccb6b5f5d' AND question_number IN (33,34,35);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'daf6961a-f47b-57ff-a0ab-2c567415eb10' AND question_number IN (1,2);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'daf6961a-f47b-57ff-a0ab-2c567415eb10' AND question_number IN (3,4);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'daf6961a-f47b-57ff-a0ab-2c567415eb10' AND question_number IN (5);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = 'deb88f83-d710-5779-be66-1256bf224e6e' AND question_number IN (7);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'deb88f83-d710-5779-be66-1256bf224e6e' AND question_number IN (1);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'deb88f83-d710-5779-be66-1256bf224e6e' AND question_number IN (2,3,4,5,6,8,9);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'deb88f83-d710-5779-be66-1256bf224e6e' AND question_number IN (10);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'f67222b6-496e-5be8-bca4-10dafee7f89e' AND question_number IN (1,2,3);
UPDATE questions SET topic = '기본', is_essential = false WHERE chapter_id = 'fc80a389-730e-59f0-8c1e-98a23bbacd26' AND question_number IN (5);
UPDATE questions SET topic = '기본', is_essential = true WHERE chapter_id = 'fc80a389-730e-59f0-8c1e-98a23bbacd26' AND question_number IN (1,2,3,4,6,7,8,9,10);
UPDATE questions SET topic = '동차', is_essential = true WHERE chapter_id = 'fc80a389-730e-59f0-8c1e-98a23bbacd26' AND question_number IN (11,12,13,14,16);
UPDATE questions SET topic = '유예', is_essential = true WHERE chapter_id = 'fc80a389-730e-59f0-8c1e-98a23bbacd26' AND question_number IN (15);

-- Disable type filters, keep essential filter
UPDATE books SET filter_config = '{"show_type_filters": false, "show_essential_filter": true, "show_star_filter": false}'::jsonb WHERE id = 'beeb92b6-3c01-4ec3-bc95-c9d6f1cb0a3f';
UPDATE books SET filter_config = '{"show_type_filters": false, "show_essential_filter": true, "show_star_filter": false}'::jsonb WHERE id = '01cd0689-5744-4f76-815d-1c6a2214ea55';

-- ===== 20260328045352_24dc1e4d-8f47-4fbf-9f75-320f71c1d7ea.sql =====
UPDATE books SET filter_config = '{"show_type_filters": true, "show_essential_filter": true, "show_star_filter": false, "group_by_type": false, "type_labels": {"example": "기본", "past_exam": "동차", "practice": "유예"}}'::jsonb WHERE id IN ('beeb92b6-3c01-4ec3-bc95-c9d6f1cb0a3f', '01cd0689-5744-4f76-815d-1c6a2214ea55')

-- ===== 20260330021201_d4671204-7303-47ca-b8f6-b7f8621a4f38.sql =====
-- 홍상연 원가관리회계 연습 7~15장 데이터 삽입 (chapters + questions)
-- 이 migration은 데이터 삽입용이지만 insert tool 제한으로 migration 사용

DO $$ BEGIN RAISE NOTICE 'Inserting chapters 7-15 for 홍상연 원가관리회계 연습'; END $$;

-- ===== 20260330030639_d0f60c21-3cd6-4b2c-ad61-f74c888a4193.sql =====

-- 홍상연 원가관리회계 연습서: book + 15 chapters + 155 questions

-- 1. Book
INSERT INTO books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'b0a1c2d3-e4f5-6789-abcd-ef0123456789',
  '54e4b9a1-998f-4584-b56a-3c954808d94f',
  '원가관리회계 연습',
  '홍상연',
  3,
  '{"show_type_filters": true, "group_by_type": false, "show_essential_filter": false, "show_star_filter": false, "type_labels": {"example": "기본", "practice": "심화"}}'::jsonb
);

-- 2. Chapters
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES
('c1010101-0001-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','제조원가의 흐름 및 간접원가 배부',1,1),
('c1010101-0002-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','활동기준원가계산(ABC)',2,2),
('c1010101-0003-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','종합원가계산',3,3),
('c1010101-0004-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','결합원가계산',4,4),
('c1010101-0005-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','표준원가계산',5,5),
('c1010101-0006-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','전부·변동·초변동원가계산',6,6),
('c1010101-0007-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','원가의 추정과 CVP 분석',7,7),
('c1010101-0008-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','관련원가와 의사결정',8,8),
('c1010101-0009-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','대체가격',9,9),
('c1010101-0010-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','종합예산',10,10),
('c1010101-0011-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','책임회계와 성과평가',11,11),
('c1010101-0012-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','자본예산',12,12),
('c1010101-0013-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','불확실성하의 의사결정',13,13),
('c1010101-0014-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','새로운 관리회계시스템',14,14),
('c1010101-0015-4000-a000-000000000001','b0a1c2d3-e4f5-6789-abcd-ef0123456789','전략적 성과평가',15,15);

-- 3. Questions
-- Ch1: 기본5 + 심화4
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0001-4000-a000-000000000001',1,'example','제조원가의 흐름'),
('c1010101-0001-4000-a000-000000000001',2,'example','제조간접원가의 배부'),
('c1010101-0001-4000-a000-000000000001',3,'example','제조부문 제조간접원가배부율'),
('c1010101-0001-4000-a000-000000000001',4,'example','단일배분율법과 이중배분율법'),
('c1010101-0001-4000-a000-000000000001',5,'example','정상원가계산 (1)'),
('c1010101-0001-4000-a000-000000000001',6,'practice','보조부문원가의 배분'),
('c1010101-0001-4000-a000-000000000001',7,'practice','정상원가계산 (2)'),
('c1010101-0001-4000-a000-000000000001',8,'practice','정상원가계산 (3)'),
('c1010101-0001-4000-a000-000000000001',9,'practice','공통원가배분');

-- Ch2: 기본6 + 심화3
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0002-4000-a000-000000000001',1,'example','활동기준원가계산'),
('c1010101-0002-4000-a000-000000000001',2,'example','고객의 수익성 분석 (1)'),
('c1010101-0002-4000-a000-000000000001',3,'example','전통적인 원가계산과 ABC (1)'),
('c1010101-0002-4000-a000-000000000001',4,'example','ABC와 원가절감'),
('c1010101-0002-4000-a000-000000000001',5,'example','ABC와 의사결정 (1)'),
('c1010101-0002-4000-a000-000000000001',6,'example','ABC와 의사결정 (2)'),
('c1010101-0002-4000-a000-000000000001',7,'practice','고객의 수익성 분석 (2)'),
('c1010101-0002-4000-a000-000000000001',8,'practice','전통적인 원가계산과 ABC (2)'),
('c1010101-0002-4000-a000-000000000001',9,'practice','ABC와 의사결정 (3)');

-- Ch3: 기본11 + 심화5
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0003-4000-a000-000000000001',1,'example','평균법'),
('c1010101-0003-4000-a000-000000000001',2,'example','선입선출법'),
('c1010101-0003-4000-a000-000000000001',3,'example','정상공손 (1)'),
('c1010101-0003-4000-a000-000000000001',4,'example','정상공손 (2)'),
('c1010101-0003-4000-a000-000000000001',5,'example','비정상공손'),
('c1010101-0003-4000-a000-000000000001',6,'example','작업공정별 원가계산 (1)'),
('c1010101-0003-4000-a000-000000000001',7,'example','작업공정별 원가계산 (2)'),
('c1010101-0003-4000-a000-000000000001',8,'example','재료의 추가투입 (1)'),
('c1010101-0003-4000-a000-000000000001',9,'example','재료의 추가투입 (2)'),
('c1010101-0003-4000-a000-000000000001',10,'example','공정별 원가계산 (1)'),
('c1010101-0003-4000-a000-000000000001',11,'example','공정별 원가계산 (2)'),
('c1010101-0003-4000-a000-000000000001',12,'practice','연속공정 원가계산'),
('c1010101-0003-4000-a000-000000000001',13,'practice','정상공손과 재료의 추가투입'),
('c1010101-0003-4000-a000-000000000001',14,'practice','선입선출법과 감손'),
('c1010101-0003-4000-a000-000000000001',15,'practice','공정별 원가계산 (3)'),
('c1010101-0003-4000-a000-000000000001',16,'practice','공정별 원가계산 (4)');

-- Ch4: 기본8 + 심화5
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0004-4000-a000-000000000001',1,'example','물량기준 배분'),
('c1010101-0004-4000-a000-000000000001',2,'example','순실현가치법 (1)'),
('c1010101-0004-4000-a000-000000000001',3,'example','순실현가치법 (2)'),
('c1010101-0004-4000-a000-000000000001',4,'example','균등이익률법'),
('c1010101-0004-4000-a000-000000000001',5,'example','부산물의 회계처리 (1)'),
('c1010101-0004-4000-a000-000000000001',6,'example','부산물의 회계처리 (2)'),
('c1010101-0004-4000-a000-000000000001',7,'example','추가가공 의사결정 (1)'),
('c1010101-0004-4000-a000-000000000001',8,'example','추가가공 의사결정 (2)'),
('c1010101-0004-4000-a000-000000000001',9,'practice','결합원가의 배분과 추가가공 의사결정'),
('c1010101-0004-4000-a000-000000000001',10,'practice','순실현가치법과 균등이익률법'),
('c1010101-0004-4000-a000-000000000001',11,'practice','공손이 있는 결합원가계산'),
('c1010101-0004-4000-a000-000000000001',12,'practice','부산물의 회계처리 (3)'),
('c1010101-0004-4000-a000-000000000001',13,'practice','결합원가의 종합');

-- Ch5: 기본6 + 심화6
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0005-4000-a000-000000000001',1,'example','직접재료원가 차이분석'),
('c1010101-0005-4000-a000-000000000001',2,'example','직접노무원가 차이분석'),
('c1010101-0005-4000-a000-000000000001',3,'example','변동제조간접원가 차이분석'),
('c1010101-0005-4000-a000-000000000001',4,'example','고정제조간접원가 차이분석'),
('c1010101-0005-4000-a000-000000000001',5,'example','배합차이와 수율차이 (1)'),
('c1010101-0005-4000-a000-000000000001',6,'example','표준종합원가계산 (1)'),
('c1010101-0005-4000-a000-000000000001',7,'practice','원가차이의 종합분석 (1)'),
('c1010101-0005-4000-a000-000000000001',8,'practice','원가차이의 종합분석 (2)'),
('c1010101-0005-4000-a000-000000000001',9,'practice','배합차이와 수율차이 (2)'),
('c1010101-0005-4000-a000-000000000001',10,'practice','표준종합원가계산 (2)'),
('c1010101-0005-4000-a000-000000000001',11,'practice','표준종합원가계산 (3)'),
('c1010101-0005-4000-a000-000000000001',12,'practice','표준종합원가계산과 공손');

-- Ch6: 기본11 + 심화4
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0006-4000-a000-000000000001',1,'example','전부/변동원가계산: 실제원가계산'),
('c1010101-0006-4000-a000-000000000001',2,'example','조업도차이와 이익차이 조정'),
('c1010101-0006-4000-a000-000000000001',3,'example','전부/변동원가계산'),
('c1010101-0006-4000-a000-000000000001',4,'example','전부/변동원가계산: 정상원가계산'),
('c1010101-0006-4000-a000-000000000001',5,'example','실제원가계산과 정상원가계산'),
('c1010101-0006-4000-a000-000000000001',6,'example','원가차이 배분'),
('c1010101-0006-4000-a000-000000000001',7,'example','이익차이 조정과 손익분기점 (1)'),
('c1010101-0006-4000-a000-000000000001',8,'example','재공품이 존재하는 경우의 이익차이 조정'),
('c1010101-0006-4000-a000-000000000001',9,'example','평균법하의 이익차이 조정'),
('c1010101-0006-4000-a000-000000000001',10,'example','평균법/정상원가계산 이익차이 조정'),
('c1010101-0006-4000-a000-000000000001',11,'example','표준종합원가계산과 이익차이 조정'),
('c1010101-0006-4000-a000-000000000001',12,'practice','이익차이 조정과 손익분기점 (2)'),
('c1010101-0006-4000-a000-000000000001',13,'practice','연속공정하에서의 이익차이 조정'),
('c1010101-0006-4000-a000-000000000001',14,'practice','전부/변동/초변동원가계산: 정상원가계산'),
('c1010101-0006-4000-a000-000000000001',15,'practice','연속공정의 표준종합원가계산과 이익차이 조정');

-- Ch7: 기본9 + 심화8
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0007-4000-a000-000000000001',1,'example','학습곡선'),
('c1010101-0007-4000-a000-000000000001',2,'example','비선형함수하의 CVP분석 (1)'),
('c1010101-0007-4000-a000-000000000001',3,'example','두 대안의 비교'),
('c1010101-0007-4000-a000-000000000001',4,'example','복수제품의 CVP분석 (1)'),
('c1010101-0007-4000-a000-000000000001',5,'example','서비스업 CVP분석 (1)'),
('c1010101-0007-4000-a000-000000000001',6,'example','서비스업 CVP분석 (2)'),
('c1010101-0007-4000-a000-000000000001',7,'example','서비스업 CVP분석 (3)'),
('c1010101-0007-4000-a000-000000000001',8,'example','안전한계율과 영업레버리지'),
('c1010101-0007-4000-a000-000000000001',9,'example','CVP 종합'),
('c1010101-0007-4000-a000-000000000001',10,'practice','누적평균시간학습모형'),
('c1010101-0007-4000-a000-000000000001',11,'practice','비선형함수하의 CVP분석 (2)'),
('c1010101-0007-4000-a000-000000000001',12,'practice','여러 대안별 CVP분석'),
('c1010101-0007-4000-a000-000000000001',13,'practice','복수제품의 CVP분석 (2)'),
('c1010101-0007-4000-a000-000000000001',14,'practice','서비스업 CVP분석 (4)'),
('c1010101-0007-4000-a000-000000000001',15,'practice','서비스업 CVP분석 (5)'),
('c1010101-0007-4000-a000-000000000001',16,'practice','CVP분석의 종합 (1)'),
('c1010101-0007-4000-a000-000000000001',17,'practice','CVP분석의 종합 (2)');

-- Ch8: 기본13 + 심화6
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0008-4000-a000-000000000001',1,'example','특별주문 의사결정 (1)'),
('c1010101-0008-4000-a000-000000000001',2,'example','특별주문 의사결정 (2)'),
('c1010101-0008-4000-a000-000000000001',3,'example','자가제조 또는 외부구입 의사결정 (1)'),
('c1010101-0008-4000-a000-000000000001',4,'example','자가제조 또는 외부구입 의사결정 (2)'),
('c1010101-0008-4000-a000-000000000001',5,'example','제약자원의 활용 (1)'),
('c1010101-0008-4000-a000-000000000001',6,'example','제약자원의 활용 (2)'),
('c1010101-0008-4000-a000-000000000001',7,'example','제품라인의 유지·폐지 (1)'),
('c1010101-0008-4000-a000-000000000001',8,'example','제품라인의 유지·폐지 (2)'),
('c1010101-0008-4000-a000-000000000001',9,'example','비계량적 요소와 의사결정'),
('c1010101-0008-4000-a000-000000000001',10,'example','기회원가와 의사결정 (1)'),
('c1010101-0008-4000-a000-000000000001',11,'example','기회원가와 의사결정 (2)'),
('c1010101-0008-4000-a000-000000000001',12,'example','기회원가와 의사결정 (3)'),
('c1010101-0008-4000-a000-000000000001',13,'example','원가정보와 가격결정'),
('c1010101-0008-4000-a000-000000000001',14,'practice','특별주문 의사결정 (3)'),
('c1010101-0008-4000-a000-000000000001',15,'practice','자가제조 또는 외부구입 의사결정 (3)'),
('c1010101-0008-4000-a000-000000000001',16,'practice','제약자원의 활용 (3)'),
('c1010101-0008-4000-a000-000000000001',17,'practice','제품라인의 유지·폐지 (3)'),
('c1010101-0008-4000-a000-000000000001',18,'practice','기회원가와 의사결정 (4)'),
('c1010101-0008-4000-a000-000000000001',19,'practice','기회원가와 의사결정 (5)');

-- Ch9: 기본7 + 심화4
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0009-4000-a000-000000000001',1,'example','대체가격의 결정원칙'),
('c1010101-0009-4000-a000-000000000001',2,'example','대체가격과 의사결정 (1)'),
('c1010101-0009-4000-a000-000000000001',3,'example','대체가격과 의사결정 (2)'),
('c1010101-0009-4000-a000-000000000001',4,'example','대체가격과 의사결정 (3)'),
('c1010101-0009-4000-a000-000000000001',5,'example','대체가격의 결정 (1)'),
('c1010101-0009-4000-a000-000000000001',6,'example','대체가격의 결정 (2)'),
('c1010101-0009-4000-a000-000000000001',7,'example','대체가격의 결정 (3)'),
('c1010101-0009-4000-a000-000000000001',8,'practice','대체가격과 의사결정 (4)'),
('c1010101-0009-4000-a000-000000000001',9,'practice','대체가격의 결정 (4)'),
('c1010101-0009-4000-a000-000000000001',10,'practice','대체가격의 결정 (5)'),
('c1010101-0009-4000-a000-000000000001',11,'practice','대체가격의 종합');

-- Ch10: 기본3 + 심화1
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0010-4000-a000-000000000001',1,'example','종합예산 (1)'),
('c1010101-0010-4000-a000-000000000001',2,'example','종합예산 (2)'),
('c1010101-0010-4000-a000-000000000001',3,'example','종합예산 (3)'),
('c1010101-0010-4000-a000-000000000001',4,'practice','종합예산의 종합');

-- Ch11: 기본5 + 심화2
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0011-4000-a000-000000000001',1,'example','투자중심점의 성과평가 (1)'),
('c1010101-0011-4000-a000-000000000001',2,'example','투자중심점의 성과평가 (2)'),
('c1010101-0011-4000-a000-000000000001',3,'example','투자중심점의 성과평가 (3)'),
('c1010101-0011-4000-a000-000000000001',4,'example','경제적부가가치 (1)'),
('c1010101-0011-4000-a000-000000000001',5,'example','경제적부가가치 (2)'),
('c1010101-0011-4000-a000-000000000001',6,'practice','투자중심점과 경제적부가가치'),
('c1010101-0011-4000-a000-000000000001',7,'practice','성과평가의 종합');

-- Ch12: 기본2 + 심화1
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0012-4000-a000-000000000001',1,'example','자본예산의 기초'),
('c1010101-0012-4000-a000-000000000001',2,'example','자본예산 (1)'),
('c1010101-0012-4000-a000-000000000001',3,'practice','자본예산 (2)');

-- Ch13: 기본3 + 심화2
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0013-4000-a000-000000000001',1,'example','불확실성하의 CVP분석'),
('c1010101-0013-4000-a000-000000000001',2,'example','정보의 가치'),
('c1010101-0013-4000-a000-000000000001',3,'example','기대효용기준 의사결정'),
('c1010101-0013-4000-a000-000000000001',4,'practice','의사결정나무분석'),
('c1010101-0013-4000-a000-000000000001',5,'practice','기대효용기준 의사결정 (2)');

-- Ch14: 기본3 + 심화4
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0014-4000-a000-000000000001',1,'example','품질원가계산'),
('c1010101-0014-4000-a000-000000000001',2,'example','활동정보를 이용한 특별주문 의사결정'),
('c1010101-0014-4000-a000-000000000001',3,'example','제약공정 (1)'),
('c1010101-0014-4000-a000-000000000001',4,'practice','목표원가계산 (1)'),
('c1010101-0014-4000-a000-000000000001',5,'practice','목표원가계산 (2)'),
('c1010101-0014-4000-a000-000000000001',6,'practice','제약공정 (2)'),
('c1010101-0014-4000-a000-000000000001',7,'practice','제약공정 (3)');

-- Ch15: 기본5 + 심화3
INSERT INTO questions (chapter_id, question_number, question_type, topic) VALUES
('c1010101-0015-4000-a000-000000000001',1,'example','균형성과표 (1)'),
('c1010101-0015-4000-a000-000000000001',2,'example','고객대응시간'),
('c1010101-0015-4000-a000-000000000001',3,'example','영업이익의 분석'),
('c1010101-0015-4000-a000-000000000001',4,'example','영업이익의 전략적 분석'),
('c1010101-0015-4000-a000-000000000001',5,'example','대리이론 (1)'),
('c1010101-0015-4000-a000-000000000001',6,'practice','균형성과표 (2)'),
('c1010101-0015-4000-a000-000000000001',7,'practice','품질원가와 생산소요시간'),
('c1010101-0015-4000-a000-000000000001',8,'practice','대리이론 (2)');

-- ===== 20260330032200_d64e7c14-56a9-42f3-9ac4-d9cca4e5fe84.sql =====
-- Add display_order column to user_books
ALTER TABLE user_books ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Allow users to update their own user_books (for reordering)
CREATE POLICY "Users can update own books"
ON user_books
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ===== 20260330044118_2aea4871-4585-48d9-a426-8d4354a89657.sql =====
UPDATE books SET filter_config = jsonb_set(filter_config, '{essential_label}', '"임필수"') WHERE id = '266af2bc-d010-496a-8c0d-a6cc80718666';

-- ===== 20260330044828_d104f9a3-8b66-42ca-a439-454bd13afac4.sql =====
ALTER TABLE questions ADD COLUMN is_priority boolean NOT NULL DEFAULT false;

-- ===== 20260330045452_f61c78c9-8d71-43fb-8425-9e222c2ca708.sql =====
UPDATE books SET filter_config = jsonb_set(
  jsonb_set(filter_config, '{show_priority_filter}', 'true'),
  '{priority_label}', '"최필수"'
) WHERE id = '266af2bc-d010-496a-8c0d-a6cc80718666';

-- ===== 20260330045929_c9123820-7a01-4de3-8f1a-4995dd032667.sql =====

-- Reset all is_priority for this book
UPDATE questions SET is_priority = false
WHERE chapter_id IN (SELECT id FROM chapters WHERE book_id = '266af2bc-d010-496a-8c0d-a6cc80718666');

-- Ch2 개별원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00002-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (1,4,5,7,8,11,12,13,14,15);

-- Ch3 종합원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00003-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (2,3,5,6,7,8,9,10,11,12,13,14,15,16,17);

-- Ch4 결합원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00004-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (2,3,4,5,6,9,10,11,12);

-- Ch5 변동원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00005-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (2,3,4,5,6,9,10,12,13,14,16);

-- Ch6 ABC
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00006-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (1,3,4,6,7,8,9,12);

-- Ch7 원가추정
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00007-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (6);

-- Ch8 CVP
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00008-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (2,3,4,7,12,14,15,17,18,19,20,21,24,25);

-- Ch9 관련원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00009-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (1,2,3,4,5,8,10,13,14,15,16,18,19,20,21,23,24,26);

-- Ch11 불확실성
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00011-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (1,2,3,6,9);

-- Ch12 종합예산
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00012-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (1,4);

-- Ch13 표준원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00013-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (2,3,7,14,16,17,18,20,21,25,26,27);

-- Ch14 판매/투자
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00014-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (2,4,8);

-- Ch15 대체가격
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00015-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (1,2,3,4,6,8,9,10,11,12,14,16);

-- Ch16 전략적 원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00016-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (5,6,7,13,15,17,18,19);

-- Ch17 전략적 성과
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00017-0000-0000-0000-000000000001' AND question_type = 'practice' AND question_number IN (1,14);

-- ===== 20260330050034_a296165b-b9de-4508-96b7-887021e1ca93.sql =====

-- Re-apply is_priority without question_type filter

-- Ch2 개별원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00002-0000-0000-0000-000000000001' AND question_number IN (1,4,5,7,8,11,12,13,14,15);

-- Ch3 종합원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00003-0000-0000-0000-000000000001' AND question_number IN (2,3,5,6,7,8,9,10,11,12,13,14,15,16,17);

-- Ch4 결합원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00004-0000-0000-0000-000000000001' AND question_number IN (2,3,4,5,6,9,10,11,12);

-- Ch5 변동원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00005-0000-0000-0000-000000000001' AND question_number IN (2,3,4,5,6,9,10,12,13,14,16);

-- Ch6 ABC
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00006-0000-0000-0000-000000000001' AND question_number IN (1,3,4,6,7,8,9,12);

-- Ch7 원가추정
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00007-0000-0000-0000-000000000001' AND question_number IN (6);

-- Ch8 CVP
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00008-0000-0000-0000-000000000001' AND question_number IN (2,3,4,7,12,14,15,17,18,19,20,21,24,25);

-- Ch9 관련원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00009-0000-0000-0000-000000000001' AND question_number IN (1,2,3,4,5,8,10,13,14,15,16,18,19,20,21,23,24,26);

-- Ch11 불확실성
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00011-0000-0000-0000-000000000001' AND question_number IN (1,2,3,6,9);

-- Ch12 종합예산
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00012-0000-0000-0000-000000000001' AND question_number IN (1,4);

-- Ch13 표준원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00013-0000-0000-0000-000000000001' AND question_number IN (2,3,7,14,16,17,18,20,21,25,26,27);

-- Ch14 판매/투자
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00014-0000-0000-0000-000000000001' AND question_number IN (2,4,8);

-- Ch15 대체가격
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00015-0000-0000-0000-000000000001' AND question_number IN (1,2,3,4,6,8,9,10,11,12,14,16);

-- Ch16 전략적 원가
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00016-0000-0000-0000-000000000001' AND question_number IN (5,6,7,13,15,17,18,19);

-- Ch17 전략적 성과
UPDATE questions SET is_priority = true
WHERE chapter_id = 'b2c00017-0000-0000-0000-000000000001' AND question_number IN (1,14);

-- ===== 20260330052539_aba841bd-8301-493a-a9fb-f938d6c932d1.sql =====

-- Add is_public and description columns to study_groups
ALTER TABLE public.study_groups
  ADD COLUMN is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN description text;

-- Add RLS policy: anyone authenticated can see public groups
CREATE POLICY "Public groups readable by all"
  ON public.study_groups
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- ===== 20260330053301_6ecbe46e-4618-4bde-b025-c3b43c14813c.sql =====

-- Set all groups to public except 와이저랩
UPDATE study_groups SET is_public = true WHERE name != '와이저랩';

-- Delete 와이저랩 group members first, then the group
DELETE FROM study_group_members WHERE group_id = '42b502a5-bcc7-429f-af98-46e624f658e2';
DELETE FROM study_groups WHERE id = '42b502a5-bcc7-429f-af98-46e624f658e2';

-- ===== 20260401012428_ff26827a-fdf7-4a4f-9a48-a3bd0505ef8c.sql =====
UPDATE public.books SET title = '원가관리회계 최적서 / 임세진' WHERE title = 'CPA 2차 최적서 원가관리회계';
UPDATE public.books SET title = '원가관리회계연습 / 이승우' WHERE title = '원가관리회계연습 2판';
UPDATE public.books SET title = '원가관리회계연습 / 홍상연' WHERE title = '원가관리회계 연습';
