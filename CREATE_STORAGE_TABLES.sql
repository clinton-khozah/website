-- Create storage_plans table for available storage upgrade plans
CREATE TABLE IF NOT EXISTS storage_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    storage_gb DECIMAL(10, 2) NOT NULL, -- Storage amount in GB
    price_usd DECIMAL(10, 2) NOT NULL,
    price_per_gb DECIMAL(10, 2) NOT NULL, -- Price per GB
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentor_storage table to track each mentor's storage
CREATE TABLE IF NOT EXISTS mentor_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    free_storage_mb DECIMAL(10, 2) DEFAULT 50.00, -- Free tier: 50 MB
    purchased_storage_gb DECIMAL(10, 2) DEFAULT 0.00, -- Additional purchased storage
    used_storage_mb DECIMAL(10, 2) DEFAULT 0.00, -- Currently used storage
    total_storage_mb DECIMAL(10, 2) GENERATED ALWAYS AS (free_storage_mb + (purchased_storage_gb * 1024)) STORED, -- Total available storage
    last_calculated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mentor_id)
);

-- Create storage_purchases table to track storage upgrade purchases
CREATE TABLE IF NOT EXISTS storage_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    storage_plan_id UUID REFERENCES storage_plans(id) ON DELETE SET NULL,
    storage_gb DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed
    purchased_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE, -- Optional: if storage has expiration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mentor_storage_mentor_id ON mentor_storage(mentor_id);
CREATE INDEX IF NOT EXISTS idx_storage_purchases_mentor_id ON storage_purchases(mentor_id);
CREATE INDEX IF NOT EXISTS idx_storage_purchases_payment_status ON storage_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_storage_plans_is_active ON storage_plans(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_storage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_storage_plans_updated_at ON storage_plans;
CREATE TRIGGER update_storage_plans_updated_at
    BEFORE UPDATE ON storage_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_storage_updated_at();

DROP TRIGGER IF EXISTS update_mentor_storage_updated_at ON mentor_storage;
CREATE TRIGGER update_mentor_storage_updated_at
    BEFORE UPDATE ON mentor_storage
    FOR EACH ROW
    EXECUTE FUNCTION update_storage_updated_at();

DROP TRIGGER IF EXISTS update_storage_purchases_updated_at ON storage_purchases;
CREATE TRIGGER update_storage_purchases_updated_at
    BEFORE UPDATE ON storage_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_storage_updated_at();

-- Create function to automatically create mentor_storage record when mentor is created
CREATE OR REPLACE FUNCTION create_mentor_storage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO mentor_storage (mentor_id, free_storage_mb, used_storage_mb)
    VALUES (NEW.id, 50.00, 0.00)
    ON CONFLICT (mentor_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create storage record for new mentors
DROP TRIGGER IF EXISTS create_mentor_storage_trigger ON mentors;
CREATE TRIGGER create_mentor_storage_trigger
    AFTER INSERT ON mentors
    FOR EACH ROW
    EXECUTE FUNCTION create_mentor_storage();

-- Insert default storage plans
INSERT INTO storage_plans (name, storage_gb, price_usd, price_per_gb, description, is_active) VALUES
    ('Basic', 1.00, 2.99, 2.99, '1 GB additional storage', TRUE),
    ('Standard', 5.00, 9.99, 1.99, '5 GB additional storage', TRUE)
ON CONFLICT DO NOTHING;

