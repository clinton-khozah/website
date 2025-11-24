-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS ad_transactions CASCADE;
DROP TABLE IF EXISTS ad_deposits CASCADE;
DROP TABLE IF EXISTS ad_impressions CASCADE;
DROP TABLE IF EXISTS ad_clicks CASCADE;
DROP TABLE IF EXISTS ad_campaigns CASCADE;
DROP TABLE IF EXISTS ad_accounts CASCADE;

-- Drop trigger and function if they exist
DROP TRIGGER IF EXISTS trigger_create_ad_account ON mentors;
DROP FUNCTION IF EXISTS create_ad_account_for_mentor();

-- Create ad_accounts table (Facebook-style prepaid account)
CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id BIGINT NOT NULL UNIQUE REFERENCES mentors(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) DEFAULT 0.00, -- Current account balance
  lifetime_spent DECIMAL(10, 2) DEFAULT 0.00, -- Total amount ever spent
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'suspended'
  cost_per_click DECIMAL(10, 4) DEFAULT 0.50, -- Default cost per click (can be customized)
  is_global BOOLEAN DEFAULT TRUE, -- Advertise globally
  is_social_media BOOLEAN DEFAULT TRUE, -- Advertise on social media
  daily_budget_limit DECIMAL(10, 2), -- Optional daily spending limit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ad_campaigns table (each mentor can have multiple campaigns)
CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- Campaign name
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'archived'
  cost_per_click DECIMAL(10, 4) DEFAULT 0.50, -- Cost per click for this campaign
  daily_budget DECIMAL(10, 2), -- Daily budget limit for this campaign
  total_clicks INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0.00,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ, -- Optional end date
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ad_clicks table for tracking clicks
CREATE TABLE ad_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  click_cost DECIMAL(10, 4) NOT NULL, -- Cost of this click
  referrer TEXT, -- Where the click came from
  user_agent TEXT,
  ip_address VARCHAR(45),
  country VARCHAR(100),
  city VARCHAR(100),
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ad_impressions table for tracking views
CREATE TABLE ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  page_url TEXT, -- Where the ad was shown
  user_agent TEXT,
  ip_address VARCHAR(45),
  country VARCHAR(100),
  city VARCHAR(100),
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ad_deposits table for tracking fund deposits
CREATE TABLE ad_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'usd',
  status VARCHAR(50) NOT NULL, -- 'pending', 'succeeded', 'failed', 'refunded'
  payment_method VARCHAR(50),
  stripe_customer_id VARCHAR(255),
  description TEXT,
  metadata JSONB,
  deposited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ad_transactions table for tracking all account transactions
CREATE TABLE ad_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
  mentor_id BIGINT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES ad_campaigns(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- 'deposit', 'click', 'refund', 'adjustment'
  amount DECIMAL(10, 2) NOT NULL, -- Positive for deposits, negative for spending
  balance_before DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  description TEXT,
  reference_id UUID, -- Reference to deposit, click, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ad_accounts_mentor_id ON ad_accounts(mentor_id);
CREATE INDEX IF NOT EXISTS idx_ad_accounts_status ON ad_accounts(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_account_id ON ad_campaigns(account_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_mentor_id ON ad_campaigns(mentor_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_campaign_id ON ad_clicks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_account_id ON ad_clicks(account_id);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_mentor_id ON ad_clicks(mentor_id);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_clicked_at ON ad_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_campaign_id ON ad_impressions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_viewed_at ON ad_impressions(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_deposits_account_id ON ad_deposits(account_id);
CREATE INDEX IF NOT EXISTS idx_ad_deposits_mentor_id ON ad_deposits(mentor_id);
CREATE INDEX IF NOT EXISTS idx_ad_deposits_status ON ad_deposits(status);
CREATE INDEX IF NOT EXISTS idx_ad_transactions_account_id ON ad_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_ad_transactions_mentor_id ON ad_transactions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_ad_transactions_created_at ON ad_transactions(created_at DESC);

-- Function to automatically create ad account when mentor is created
CREATE OR REPLACE FUNCTION create_ad_account_for_mentor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ad_accounts (mentor_id)
  VALUES (NEW.id)
  ON CONFLICT (mentor_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create ad account when mentor is created
DROP TRIGGER IF EXISTS trigger_create_ad_account ON mentors;
CREATE TRIGGER trigger_create_ad_account
  AFTER INSERT ON mentors
  FOR EACH ROW
  EXECUTE FUNCTION create_ad_account_for_mentor();
