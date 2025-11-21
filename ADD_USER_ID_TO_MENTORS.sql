-- Add user_id column to mentors table to link to Supabase Auth users
-- Run this in your Supabase SQL Editor

-- Add user_id column (UUID type) to link to Supabase Auth
ALTER TABLE mentors 
ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON mentors(user_id);

-- Add comment for documentation
COMMENT ON COLUMN mentors.user_id IS 'Links to Supabase Auth users.id (UUID)';

