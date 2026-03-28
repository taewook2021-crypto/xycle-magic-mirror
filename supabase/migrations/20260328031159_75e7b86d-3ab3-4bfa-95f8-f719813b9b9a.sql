
-- 1. 중급회계연습 - 김영덕 (1권, 19챕터, 189문항)
INSERT INTO books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'e1000000-0000-0000-0000-000000000001',
  '97de4fc8-e472-4ef3-ab9a-fba00a87b405',
  '중급회계연습 - 김영덕',
  '김영덕',
  2,
  '{"show_type_filters": false, "show_star_filter": false}'::jsonb
);

INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES
('e1010000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', '수익', 1, 1),
('e1010000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', '건설계약', 2, 2),
('e1010000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', '현금흐름표', 3, 3),
('e1010000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000001', '재고자산과 농림어업', 4, 4),
('e1010000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000001', '유형자산', 5, 5),
('e1010000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000001', '차입원가', 6, 6),
('e1010000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000001', '무형자산', 7, 7),
('e1010000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000001', '금융부채', 8, 8),
('e1010000-0000-0000-0000-000000000009', 'e1000000-0000-0000-0000-000000000001', '충당부채와 보고기간후 사건', 9, 9),
('e1010000-0000-0000-0000-000000000010', 'e1000000-0000-0000-0000-000000000001', '자본', 10, 10),
('e1010000-0000-0000-0000-000000000011', 'e1000000-0000-0000-0000-000000000001', '금융자산', 11, 11),
('e1010000-0000-0000-0000-000000000012', 'e1000000-0000-0000-0000-000000000001', '복합금융상품', 12, 12),
('e1010000-0000-0000-0000-000000000013', 'e1000000-0000-0000-0000-000000000001', '종업원급여', 13, 13),
('e1010000-0000-0000-0000-000000000014', 'e1000000-0000-0000-0000-000000000001', '주식기준보상', 14, 14),
('e1010000-0000-0000-0000-000000000015', 'e1000000-0000-0000-0000-000000000001', '리스회계', 15, 15),
('e1010000-0000-0000-0000-000000000016', 'e1000000-0000-0000-0000-000000000001', '투자부동산과 매각예정비유동자산', 16, 16),
('e1010000-0000-0000-0000-000000000017', 'e1000000-0000-0000-0000-000000000001', '법인세회계', 17, 17),
('e1010000-0000-0000-0000-000000000018', 'e1000000-0000-0000-0000-000000000001', '회계변경과 오류수정', 18, 18),
('e1010000-0000-0000-0000-000000000019', 'e1000000-0000-0000-0000-000000000001', '주당이익', 19, 19);

-- 중급 문항 삽입 (ch1:19, ch2:6, ch3:14, ch4:9, ch5:13, ch6:4, ch7:6, ch8:6, ch9:8, ch10:7, ch11:12, ch12:9, ch13:5, ch14:13, ch15:16, ch16:6, ch17:11, ch18:17, ch19:8)
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000001', generate_series(1,19), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000002', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000003', generate_series(1,14), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000004', generate_series(1,9), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000005', generate_series(1,13), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000006', generate_series(1,4), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000007', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000008', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000009', generate_series(1,8), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000010', generate_series(1,7), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000011', generate_series(1,12), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000012', generate_series(1,9), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000013', generate_series(1,5), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000014', generate_series(1,13), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000015', generate_series(1,16), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000016', generate_series(1,6), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000017', generate_series(1,11), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000018', generate_series(1,17), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e1010000-0000-0000-0000-000000000019', generate_series(1,8), 'example', false;

-- 2. 고급회계연습 - 김영덕 (5챕터, 97문항)
INSERT INTO books (id, subject_id, title, author, display_order, filter_config)
VALUES (
  'e2000000-0000-0000-0000-000000000001',
  'ca2c6188-1861-4428-a7f7-38f2b4b75cec',
  '고급회계연습 - 김영덕',
  '김영덕',
  2,
  '{"show_type_filters": false, "show_star_filter": false}'::jsonb
);

INSERT INTO chapters (id, book_id, title, chapter_number, display_order) VALUES
('e2010000-0000-0000-0000-000000000001', 'e2000000-0000-0000-0000-000000000001', '사업결합', 1, 1),
('e2010000-0000-0000-0000-000000000002', 'e2000000-0000-0000-0000-000000000001', '관계기업과 공동기업 투자', 2, 2),
('e2010000-0000-0000-0000-000000000003', 'e2000000-0000-0000-0000-000000000001', '연결회계', 3, 3),
('e2010000-0000-0000-0000-000000000004', 'e2000000-0000-0000-0000-000000000001', '환율변동효과', 4, 4),
('e2010000-0000-0000-0000-000000000005', 'e2000000-0000-0000-0000-000000000001', '파생상품', 5, 5);

INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000001', generate_series(1,17), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000002', generate_series(1,11), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000003', generate_series(1,38), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000004', generate_series(1,14), 'example', false;
INSERT INTO questions (chapter_id, question_number, question_type, is_essential)
SELECT 'e2010000-0000-0000-0000-000000000005', generate_series(1,17), 'example', false;
