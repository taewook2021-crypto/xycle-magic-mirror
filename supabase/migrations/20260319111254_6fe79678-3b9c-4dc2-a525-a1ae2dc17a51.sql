INSERT INTO public.subjects (name, display_order) VALUES
  ('중급회계', 1),
  ('고급회계', 3),
  ('세법', 4),
  ('원가관리회계', 5)
ON CONFLICT DO NOTHING;