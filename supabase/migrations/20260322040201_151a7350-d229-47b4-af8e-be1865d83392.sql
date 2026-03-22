
-- Update seed attempts to spread across recent days including today
-- Spread each user's attempts across recent 7 days with some today
UPDATE attempts
SET attempted_at = now() - (random() * interval '6 days')
WHERE user_id::text LIKE 'dddd%';
