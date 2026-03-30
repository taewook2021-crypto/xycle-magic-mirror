UPDATE books SET filter_config = jsonb_set(
  jsonb_set(filter_config, '{show_priority_filter}', 'true'),
  '{priority_label}', '"최필수"'
) WHERE id = '266af2bc-d010-496a-8c0d-a6cc80718666';