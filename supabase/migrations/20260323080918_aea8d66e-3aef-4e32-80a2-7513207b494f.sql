-- Clear all topic values for 임세진 원가관리회계 최적서 questions
UPDATE questions SET topic = NULL WHERE chapter_id IN (
  SELECT id FROM chapters WHERE book_id = '266af2bc-d010-496a-8c0d-a6cc80718666'
);

-- Update filter_config to enable exam_year column display
UPDATE books SET filter_config = '{"show_type_filters": false, "show_star_filter": false, "show_essential_filter": true, "show_exam_year_column": true}'::jsonb WHERE id = '266af2bc-d010-496a-8c0d-a6cc80718666';