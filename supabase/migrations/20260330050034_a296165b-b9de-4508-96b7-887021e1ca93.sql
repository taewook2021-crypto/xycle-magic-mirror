
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
