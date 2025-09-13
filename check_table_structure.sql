-- Check if table structure matches what Supabase expects
-- Run this in Supabase SQL Editor if realtime still not working

-- 1. Verify table exists and structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check sample data to verify structure
SELECT * FROM messages LIMIT 1;

-- 3. Check if there are any constraints or triggers that might interfere
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'messages';

-- 4. Check table permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'messages';

-- 5. Verify realtime publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename = 'messages';

