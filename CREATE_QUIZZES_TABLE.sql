-- Create quizzes/assessments table for mentors to create quizzes for students
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    time_limit INTEGER, -- Time limit in minutes (NULL = no time limit)
    passing_score DECIMAL(5, 2) DEFAULT 60.00, -- Minimum score to pass (percentage)
    max_attempts INTEGER DEFAULT 1, -- Maximum number of attempts allowed
    due_date TIMESTAMP WITH TIME ZONE, -- Due date for quiz completion
    is_published BOOLEAN DEFAULT FALSE, -- Whether quiz is published and visible to students
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_questions table to store questions for each quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'true_false', 'short_answer', 'essay'
    points DECIMAL(5, 2) DEFAULT 1.00,
    order_index INTEGER NOT NULL, -- Order of question in quiz
    options JSONB, -- For multiple choice: array of options
    correct_answer TEXT, -- Correct answer (varies by question type)
    explanation TEXT, -- Explanation shown after submission
    image_url TEXT, -- URL to image/diagram for the question
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table to track student attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    time_taken INTEGER, -- Time taken in seconds
    score DECIMAL(10, 2),
    percentage_score DECIMAL(5, 2),
    is_passed BOOLEAN,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'graded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_answers table to store student answers
CREATE TABLE IF NOT EXISTS quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    is_correct BOOLEAN,
    points_earned DECIMAL(5, 2) DEFAULT 0.00,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shared_materials table to track shared study materials with students
CREATE TABLE IF NOT EXISTS shared_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES study_materials(id) ON DELETE CASCADE,
    learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    learner_email VARCHAR(255) NOT NULL, -- Store email for lookup
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    shared_by BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(material_id, learner_email)
);

-- Create shared_quizzes table to track shared quizzes with students
CREATE TABLE IF NOT EXISTS shared_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    learner_email VARCHAR(255) NOT NULL, -- Store email for lookup
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    shared_by BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(quiz_id, learner_email)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quizzes_mentor_id ON quizzes(mentor_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_session_id ON quizzes(session_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_is_published ON quizzes(is_published);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(quiz_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_learner_id ON quiz_attempts(learner_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt_id ON quiz_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question_id ON quiz_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_shared_materials_material_id ON shared_materials(material_id);
CREATE INDEX IF NOT EXISTS idx_shared_materials_learner_id ON shared_materials(learner_id);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_quiz_id ON shared_quizzes(quiz_id);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_learner_id ON shared_quizzes(learner_id);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
DROP TRIGGER IF EXISTS update_quiz_questions_updated_at ON quiz_questions;
DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON quiz_attempts;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_quizzes_updated_at 
    BEFORE UPDATE ON quizzes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at 
    BEFORE UPDATE ON quiz_questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at 
    BEFORE UPDATE ON quiz_attempts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE quizzes IS 'Stores quizzes/assessments created by mentors';
COMMENT ON TABLE quiz_questions IS 'Stores questions for each quiz';
COMMENT ON TABLE quiz_attempts IS 'Tracks student attempts at quizzes';
COMMENT ON TABLE quiz_answers IS 'Stores individual answers for each quiz attempt';
COMMENT ON TABLE shared_materials IS 'Tracks study materials shared with students';
COMMENT ON TABLE shared_quizzes IS 'Tracks quizzes shared with students';

