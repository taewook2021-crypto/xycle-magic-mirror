
-- Move some seed attempts to today so "오늘 풀이 수" ranking shows data
UPDATE attempts
SET attempted_at = now() - (random() * interval '12 hours')
WHERE user_id::text LIKE 'dddd%'
AND id IN (
  SELECT id FROM attempts 
  WHERE user_id::text LIKE 'dddd%' 
  ORDER BY random() 
  LIMIT 40
);
