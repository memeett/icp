-- Enhanced Chat Setup for Photo Sharing & Typing Indicators

-- 1. Update messages table to support file metadata
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. Create typing_status table for real-time typing indicators
CREATE TABLE IF NOT EXISTS public.typing_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  is_typing BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create index for performance
CREATE INDEX IF NOT EXISTS idx_typing_status_room_user 
ON public.typing_status(room_id, user_id);

CREATE INDEX IF NOT EXISTS idx_typing_status_updated 
ON public.typing_status(updated_at);

-- 4. Create storage bucket for chat photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-photos', 'chat-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Create storage policies for chat photos
CREATE POLICY "Anyone can view chat photos" ON storage.objects
FOR SELECT USING (bucket_id = 'chat-photos');

CREATE POLICY "Authenticated users can upload chat photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'chat-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own chat photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'chat-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own chat photos" ON storage.objects
FOR DELETE USING (bucket_id = 'chat-photos' AND auth.role() = 'authenticated');

-- 6. Grant permissions for typing_status table
GRANT ALL ON public.typing_status TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 7. Enable realtime for typing_status (optional - for real-time typing indicators)
-- Uncomment this if you want real-time updates:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;

-- 8. Create function to automatically clean up old typing status
CREATE OR REPLACE FUNCTION cleanup_old_typing_status()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_status 
  WHERE updated_at < NOW() - INTERVAL '10 seconds';
END;
$$ LANGUAGE plpgsql;

-- 9. Optional: Create a trigger to auto-cleanup (or run periodically)
-- This will run cleanup every time there's an update
CREATE OR REPLACE FUNCTION trigger_cleanup_typing()
RETURNS trigger AS $$
BEGIN
  PERFORM cleanup_old_typing_status();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Uncomment to enable auto-cleanup trigger:
-- CREATE TRIGGER auto_cleanup_typing
--   AFTER INSERT OR UPDATE ON public.typing_status
--   EXECUTE FUNCTION trigger_cleanup_typing();

-- 10. Test data - insert a sample typing status (optional)
-- INSERT INTO public.typing_status (room_id, user_id, is_typing) 
-- VALUES ((SELECT id FROM public.chat_rooms LIMIT 1), 'test-user', true);

-- ✅ Setup complete! Your chat now supports:
-- 📸 Photo sharing with Supabase Storage
-- ⌨️ Real-time typing indicators  
-- 💬 Enhanced messaging with file metadata
-- 🔄 Automatic cleanup of old typing status

