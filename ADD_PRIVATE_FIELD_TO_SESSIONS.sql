-- Add private field to sessions table
-- If private is false, the session will appear on all learner dashboards
-- If private is true, the session will only appear for the specific learner who booked it

ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS private BOOLEAN DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_private ON sessions(private);

-- Update existing sessions to be public by default (private = false)
UPDATE sessions 
SET private = false 
WHERE private IS NULL;

-- Add comment to describe the private column
COMMENT ON COLUMN sessions.private IS 'If false, session appears on all learner dashboards. If true, only visible to the specific learner who booked it.';

