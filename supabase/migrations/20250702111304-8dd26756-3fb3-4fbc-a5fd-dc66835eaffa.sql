-- Remove story_points and business_value columns, add notes column
ALTER TABLE public.backlog_items 
DROP COLUMN IF EXISTS story_points,
DROP COLUMN IF EXISTS business_value,
ADD COLUMN notes TEXT;