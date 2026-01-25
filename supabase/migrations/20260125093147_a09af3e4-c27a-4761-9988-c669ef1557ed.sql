-- Add scheduled_at column to blogs table for scheduling functionality
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update the RLS policy to show scheduled blogs that are due
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;

CREATE POLICY "Anyone can view published blogs" 
ON public.blogs 
FOR SELECT 
USING (
  status = 'published' AND (
    published_at IS NOT NULL AND published_at <= now()
  )
);