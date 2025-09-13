-- Enable Supabase Realtime for Chat Messages
-- Jalankan ini di Supabase SQL Editor untuk mengaktifkan real-time

-- 1. Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 2. Enable realtime for chat_rooms table (optional, for room updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;

-- 3. Verify realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- ✅ After running this, real-time updates should work!

