-- Quick fix untuk typing indicators
-- Jalankan di Supabase SQL Editor jika ingin typing indicators

-- 1. Create typing_status table
CREATE TABLE IF NOT EXISTS public.typing_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  is_typing BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_typing_status_room_user 
ON public.typing_status(room_id, user_id);

-- 3. Grant permissions
GRANT ALL ON public.typing_status TO anon, authenticated;

-- ✅ Done! Typing indicators will now work

