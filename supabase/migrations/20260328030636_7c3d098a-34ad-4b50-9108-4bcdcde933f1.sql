
-- 1. Insert book
INSERT INTO books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'd2000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  '재무관리연습 11판',
  '김민환',
  2,
  '{"show_type_filters": false, "show_star_filter": false}'::jsonb
);

-- 2. Insert 16 chapters
INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES
('d2010000-0000-0000-0000-000000000001', 'd2000000-0000-0000-0000-000000000001', '재무관리의 기초', 1, 1),
('d2010000-0000-0000-0000-000000000002', 'd2000000-0000-0000-0000-000000000001', '불확실성 하의 최적선택', 2, 2),
('d2010000-0000-0000-0000-000000000003', 'd2000000-0000-0000-0000-000000000001', '위험과 수익률의 균형관계', 3, 3),
('d2010000-0000-0000-0000-000000000004', 'd2000000-0000-0000-0000-000000000001', '가치평가의 원리', 4, 4),
('d2010000-0000-0000-0000-000000000005', 'd2000000-0000-0000-0000-000000000001', '기업가치의 평가', 5, 5),
('d2010000-0000-0000-0000-000000000006', 'd2000000-0000-0000-0000-000000000001', '투자안의 평가(자본예산)', 6, 6),
('d2010000-0000-0000-0000-000000000007', 'd2000000-0000-0000-0000-000000000001', '합병(M&A)의 평가', 7, 7),
('d2010000-0000-0000-0000-000000000008', 'd2000000-0000-0000-0000-000000000001', '리스의 평가', 8, 8),
('d2010000-0000-0000-0000-000000000009', 'd2000000-0000-0000-0000-000000000001', '채권가치평가와 채권투자전략', 9, 9),
('d2010000-0000-0000-0000-000000000010', 'd2000000-0000-0000-0000-000000000001', '주식가치의 평가', 10, 10),
('d2010000-0000-0000-0000-000000000011', 'd2000000-0000-0000-0000-000000000001', '옵션가치의 평가', 11, 11),
('d2010000-0000-0000-0000-000000000012', 'd2000000-0000-0000-0000-000000000001', '옵션의 응용', 12, 12),
('d2010000-0000-0000-0000-000000000013', 'd2000000-0000-0000-0000-000000000001', '선물가격의 결정', 13, 13),
('d2010000-0000-0000-0000-000000000014', 'd2000000-0000-0000-0000-000000000001', '환율의 결정과 국제자본예산', 14, 14),
('d2010000-0000-0000-0000-000000000015', 'd2000000-0000-0000-0000-000000000001', '스왑의 평가', 15, 15),
('d2010000-0000-0000-0000-000000000016', 'd2000000-0000-0000-0000-000000000001', '위험관리', 16, 16);

-- 3. Insert questions (434 total)
-- Ch1: 17 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential) VALUES
('d2010000-0000-0000-0000-000000000001', 1, 'example', false),
('d2010000-0000-0000-0000-000000000001', 2, 'example', false),
('d2010000-0000-0000-0000-000000000001', 3, 'example', false),
('d2010000-0000-0000-0000-000000000001', 4, 'example', false),
('d2010000-0000-0000-0000-000000000001', 5, 'example', false),
('d2010000-0000-0000-0000-000000000001', 6, 'example', false),
('d2010000-0000-0000-0000-000000000001', 7, 'example', false),
('d2010000-0000-0000-0000-000000000001', 8, 'example', false),
('d2010000-0000-0000-0000-000000000001', 9, 'example', false),
('d2010000-0000-0000-0000-000000000001', 10, 'example', false),
('d2010000-0000-0000-0000-000000000001', 11, 'example', false),
('d2010000-0000-0000-0000-000000000001', 12, 'example', false),
('d2010000-0000-0000-0000-000000000001', 13, 'example', false),
('d2010000-0000-0000-0000-000000000001', 14, 'example', false),
('d2010000-0000-0000-0000-000000000001', 15, 'example', false),
('d2010000-0000-0000-0000-000000000001', 16, 'example', false),
('d2010000-0000-0000-0000-000000000001', 17, 'example', false);

-- Ch2: 37 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000002', generate_series(1, 37), 'example', false;

-- Ch3: 37 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000003', generate_series(1, 37), 'example', false;

-- Ch4: 11 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000004', generate_series(1, 11), 'example', false;

-- Ch5: 55 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000005', generate_series(1, 55), 'example', false;

-- Ch6: 48 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000006', generate_series(1, 48), 'example', false;

-- Ch7: 21 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000007', generate_series(1, 21), 'example', false;

-- Ch8: 3 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000008', generate_series(1, 3), 'example', false;

-- Ch9: 46 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000009', generate_series(1, 46), 'example', false;

-- Ch10: 9 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000010', generate_series(1, 9), 'example', false;

-- Ch11: 42 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000011', generate_series(1, 42), 'example', false;

-- Ch12: 36 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000012', generate_series(1, 36), 'example', false;

-- Ch13: 20 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000013', generate_series(1, 20), 'example', false;

-- Ch14: 11 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000014', generate_series(1, 11), 'example', false;

-- Ch15: 6 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000015', generate_series(1, 6), 'example', false;

-- Ch16: 35 questions
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'd2010000-0000-0000-0000-000000000016', generate_series(1, 35), 'example', false;
