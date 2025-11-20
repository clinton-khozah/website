-- Create students table in Supabase
-- This table stores student/learner user data
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  website VARCHAR(500),
  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  country VARCHAR(100),
  city VARCHAR(100),
  timezone VARCHAR(50),
  native_language VARCHAR(50),
  languages_spoken JSONB DEFAULT '[]',
  current_level VARCHAR(50) DEFAULT 'beginner',
  interests JSONB DEFAULT '[]',
  learning_goals TEXT,
  preferred_learning_style VARCHAR(50),
  availability_hours VARCHAR(100),
  budget_range VARCHAR(50),
  social_links JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_verified ON students(verified);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view their own student data"
  ON students
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own student data"
  ON students
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own student data"
  ON students
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add comment for documentation
COMMENT ON TABLE students IS 'Stores student/learner user profile data';

