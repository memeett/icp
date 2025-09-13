-- Verify Realtime Setup
-- Run this in Supabase SQL Editor

-- 1. Check if messages table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check current realtime publications
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- 3. Enable realtime for messages table (if not already)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 4. Verify again
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename = 'messages';

-- 5. Check if realtime is enabled at database level
SELECT setting FROM pg_settings WHERE name = 'wal_level';
-- Should return 'logical'

-- 6. Check replication slots
SELECT slot_name, plugin, slot_type, active 
FROM pg_replication_slots 
WHERE slot_name LIKE '%realtime%';

