-- Add transcript column to videos table for storing Whisper transcriptions
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS transcript_status TEXT DEFAULT 'pending';

-- Add content_type and content_data columns to content table for per-format generation
ALTER TABLE public.content 
ADD COLUMN IF NOT EXISTS content_type TEXT,
ADD COLUMN IF NOT EXISTS content_data JSONB,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add unique constraint for one content per type per video
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'content_video_type_unique'
  ) THEN
    ALTER TABLE public.content ADD CONSTRAINT content_video_type_unique UNIQUE (video_id, content_type);
  END IF;
END $$;