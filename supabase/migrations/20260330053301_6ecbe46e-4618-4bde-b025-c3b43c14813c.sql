
-- Set all groups to public except 와이저랩
UPDATE study_groups SET is_public = true WHERE name != '와이저랩';

-- Delete 와이저랩 group members first, then the group
DELETE FROM study_group_members WHERE group_id = '42b502a5-bcc7-429f-af98-46e624f658e2';
DELETE FROM study_groups WHERE id = '42b502a5-bcc7-429f-af98-46e624f658e2';
