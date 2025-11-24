-- Create study_materials table for mentors to store their study materials
CREATE TABLE IF NOT EXISTS study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size BIGINT,
    category VARCHAR(100),
    tags TEXT[], -- Array of tags for categorization
    is_public BOOLEAN DEFAULT FALSE, -- Whether material can be shared with students
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table for assignments given to students
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    learner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    max_score DECIMAL(10, 2) DEFAULT 100.00,
    status VARCHAR(50) DEFAULT 'assigned', -- assigned, in_progress, submitted, graded, overdue
    submission_text TEXT,
    submission_file_url TEXT,
    submission_file_name VARCHAR(255),
    submitted_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(10, 2),
    feedback TEXT,
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by BIGINT REFERENCES mentors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_study_materials_mentor_id ON study_materials(mentor_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_category ON study_materials(category);
CREATE INDEX IF NOT EXISTS idx_study_materials_created_at ON study_materials(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_tasks_mentor_id ON tasks(mentor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_learner_id ON tasks(learner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_study_materials_updated_at 
    BEFORE UPDATE ON study_materials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE study_materials IS 'Stores study materials uploaded by mentors/tutors';
COMMENT ON TABLE tasks IS 'Stores tasks/assignments created by mentors for specific sessions';
COMMENT ON COLUMN tasks.status IS 'Task status: assigned, in_progress, submitted, graded, overdue';
COMMENT ON COLUMN study_materials.is_public IS 'If true, material can be shared with students in sessions';

