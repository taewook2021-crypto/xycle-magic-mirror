
-- Remove seed attempts for fake users
DELETE FROM attempts WHERE user_id::text LIKE 'dddd%';

-- Remove seed profiles for fake users
DELETE FROM profiles WHERE id::text LIKE 'dddd%';
