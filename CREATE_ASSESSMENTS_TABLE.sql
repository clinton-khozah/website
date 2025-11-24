-- Create assessments table for document-based assessments
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    document_url TEXT NOT NULL, -- URL to uploaded document
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100),
    document_size BIGINT, -- Size in bytes
    due_date TIMESTAMP WITH TIME ZONE,
    max_score DECIMAL(10, 2),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shared_assessments table to track which students have access
CREATE TABLE IF NOT EXISTS shared_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    learner_email VARCHAR(255),
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    shared_by BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, learner_email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_mentor_id ON assessments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_assessments_due_date ON assessments(due_date);
CREATE INDEX IF NOT EXISTS idx_shared_assessments_assessment_id ON shared_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_shared_assessments_learner_email ON shared_assessments(learner_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_assessments_updated_at();

