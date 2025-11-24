-- Add payment method columns to mentors table
-- Run this in your Supabase SQL Editor

-- Add payment_method field (bank_transfer, paypal, stripe, crypto)
ALTER TABLE mentors 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Add payment_account_details field (JSONB for storing all payment details)
ALTER TABLE mentors 
ADD COLUMN IF NOT EXISTS payment_account_details JSONB;

-- Add comments for documentation
COMMENT ON COLUMN mentors.payment_method IS 'Payment method type: bank_transfer, paypal, stripe, or crypto';
COMMENT ON COLUMN mentors.payment_account_details IS 'JSON object containing payment account details based on payment_method';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'mentors' 
  AND column_name IN ('payment_method', 'payment_account_details')
ORDER BY column_name;

