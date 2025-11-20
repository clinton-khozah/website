-- Add is_complete and role fields to students table
-- This field tracks whether a student has completed their profile for verification
-- Run this in your Supabase SQL Editor

ALTER TABLE students 
ADD COLUMN IF NOT EXISTS is_complete BOOLEAN DEFAULT FALSE;

ALTER TABLE students 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student';

-- Update existing records to set is_complete based on profile completeness
-- A profile is considered complete if it has: full_name, email, bio, phone_number, country, and city
UPDATE students 
SET is_complete = CASE 
  WHEN full_name IS NOT NULL 
    AND email IS NOT NULL 
    AND bio IS NOT NULL 
    AND phone_number IS NOT NULL 
    AND country IS NOT NULL 
    AND city IS NOT NULL 
  THEN TRUE 
  ELSE FALSE 
END
WHERE is_complete IS NULL OR is_complete = FALSE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_students_is_complete ON students(is_complete);
CREATE INDEX IF NOT EXISTS idx_students_role ON students(role);

-- Add comments for documentation
COMMENT ON COLUMN students.is_complete IS 'Indicates whether the student has completed their profile for verification';
COMMENT ON COLUMN students.role IS 'Role of the student (e.g., student, admin, etc.)';

