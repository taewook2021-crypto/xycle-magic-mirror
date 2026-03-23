-- Move all chapters from 연습서 to 최적서
UPDATE chapters SET book_id = '266af2bc-d010-496a-8c0d-a6cc80718666' WHERE book_id = 'b2000000-0000-0000-0000-000000000001';

-- Delete the 연습서 book record
DELETE FROM books WHERE id = 'b2000000-0000-0000-0000-000000000001';

-- Update filter_config for the 최적서
UPDATE books SET filter_config = '{"show_type_filters": false, "show_star_filter": false}'::jsonb WHERE id = '266af2bc-d010-496a-8c0d-a6cc80718666';