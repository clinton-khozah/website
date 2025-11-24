# Facebook-Style Advertising System Setup Guide

## Overview

This advertising system works like Facebook Ads - mentors deposit money into a prepaid ad account and pay per click. No packages, just add funds and create campaigns.

## Features

- ✅ Prepaid account model (like Facebook Ads)
- ✅ Add funds to account balance
- ✅ Create multiple campaigns
- ✅ Cost-per-click (CPC) pricing
- ✅ Daily budget limits per campaign
- ✅ Real-time click and impression tracking
- ✅ Analytics dashboard with performance metrics
- ✅ Transaction history
- ✅ Automatic balance deduction on clicks

## Database Setup

### Step 1: Run SQL Migration

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the SQL from `CREATE_ADVERTISING_TABLES.sql`

This will create the following tables:
- `ad_accounts` - Prepaid ad accounts with balance
- `ad_campaigns` - Individual advertising campaigns
- `ad_clicks` - Click tracking data
- `ad_impressions` - Impression/view tracking
- `ad_deposits` - Fund deposit records
- `ad_transactions` - All account transactions

### Step 2: Verify Tables

Check that all tables were created successfully:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'ad%';
```

## Backend Setup

### Step 1: Verify API Endpoints

The following endpoints are available at `/api/v1/mentors/ads/`:

- `GET /account/<mentor_id>/` - Get ad account details
- `POST /deposit/create-payment-intent/` - Create payment intent to add funds
- `POST /deposit/confirm/` - Confirm deposit and add funds to account
- `GET /campaigns/<mentor_id>/` - Get all campaigns for a mentor
- `POST /campaigns/create/` - Create a new campaign
- `GET /campaigns/analytics/<campaign_id>/` - Get analytics for a campaign
- `POST /track-click/` - Track an ad click (deducts from balance)
- `POST /track-impression/` - Track an ad impression
- `GET /transactions/<mentor_id>/` - Get transaction history

### Step 2: Verify Stripe Configuration

Ensure your Django settings have Stripe keys configured:
```python
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', '')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
```

## Frontend Setup

### Step 1: Environment Variables

Add to your `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 2: Verify Pages

The following pages are available:
- `/dashboard/advertising` - Account overview and add funds
- `/dashboard/advertising/campaigns` - Create and manage campaigns
- `/dashboard/advertising/analytics` - View campaign analytics

### Step 3: Sidebar Navigation

The "Advertising" link has been added to the mentor/tutor sidebar navigation.

## Usage Guide

### For Mentors/Tutors

1. **Add Funds to Account**
   - Navigate to Dashboard → Advertising
   - Click "Add Funds"
   - Enter amount (minimum $5.00)
   - Complete payment via Stripe
   - Funds are added to your account balance immediately

2. **Create a Campaign**
   - Navigate to Dashboard → Advertising → Campaigns
   - Click "Create Campaign"
   - Set campaign name, cost per click, and optional daily budget
   - Campaign starts immediately if you have sufficient balance

3. **View Analytics**
   - Navigate to Dashboard → Advertising → Analytics
   - Select a campaign
   - View metrics:
     - Total clicks and impressions
     - Click-through rate (CTR)
     - Total spent
     - Clicks by country
     - Recent click history

4. **Monitor Balance**
   - View your account balance on the main advertising page
   - See lifetime spending
   - Add more funds anytime

### For Developers

#### Tracking Ad Clicks

When displaying mentor profiles with active campaigns, track clicks:

```typescript
import { trackAdClick } from '@/lib/ad-tracking'

// When user clicks on a mentor profile
const handleMentorClick = async (mentorId: number, campaignId: string) => {
  await trackAdClick({
    campaignId,
    mentorId,
    referrer: document.referrer,
  })
  
  // Navigate to mentor profile
  router.push(`/mentors/${mentorId}`)
}
```

#### Tracking Ad Impressions

Track when ads are viewed:

```typescript
import { trackAdImpression } from '@/lib/ad-tracking'
import { useEffect } from 'react'

function MentorCard({ mentor, campaignId }) {
  useEffect(() => {
    if (campaignId && mentor.id) {
      trackAdImpression({
        campaignId,
        mentorId: mentor.id,
        pageUrl: window.location.href,
      })
    }
  }, [campaignId, mentor.id])
  
  // ... rest of component
}
```

## How It Works

### Account Balance Model

1. **Deposit Funds**
   - User adds money to their ad account
   - Minimum deposit: $5.00
   - Funds are available immediately after payment

2. **Create Campaign**
   - User creates a campaign with:
     - Campaign name
     - Cost per click (default $0.50)
     - Optional daily budget limit
   - Campaign is active immediately if balance is sufficient

3. **Pay Per Click**
   - When someone clicks on the ad:
     - Click is tracked
     - Cost per click is deducted from account balance
     - Transaction is recorded
   - Campaign pauses automatically if balance is insufficient

4. **Daily Budget Limits**
   - Optional daily budget per campaign
   - When daily limit is reached, clicks stop for that day
   - Resets at midnight

## Payment Flow

1. User clicks "Add Funds"
2. Enters amount (minimum $5.00)
3. System creates Stripe Payment Intent
4. User completes payment via Stripe
5. System confirms payment
6. Funds are added to account balance
7. Transaction is recorded

## Click Tracking Flow

1. User views mentor profile (impression tracked)
2. User clicks on mentor profile (click tracked)
3. System:
   - Checks account balance
   - Checks daily budget (if set)
   - Deducts cost per click from balance
   - Records click with location data
   - Updates campaign statistics
   - Creates transaction record

## Account Management

- **Balance**: Current available funds
- **Lifetime Spent**: Total amount ever spent on advertising
- **Status**: Account can be active, paused, or suspended
- **Cost Per Click**: Default CPC (can be overridden per campaign)
- **Daily Budget Limit**: Optional account-wide daily spending limit

## Campaign Management

- **Multiple Campaigns**: Create as many campaigns as needed
- **Individual Settings**: Each campaign has its own CPC and daily budget
- **Status Control**: Pause, resume, or archive campaigns
- **Analytics**: Track performance per campaign

## Analytics Metrics

- **Total Clicks**: Number of clicks on the campaign
- **Total Impressions**: Number of times ad was viewed
- **CTR (Click-Through Rate)**: (Clicks / Impressions) × 100
- **Total Spent**: Total amount spent on clicks for this campaign
- **Clicks by Country**: Geographic distribution of clicks
- **Recent Clicks**: Last 10 clicks with details

## Transaction History

All account activity is tracked:
- Deposits (adding funds)
- Clicks (spending)
- Refunds (if applicable)
- Adjustments (manual changes)

## Troubleshooting

### Payment Issues
- Verify Stripe keys are correctly configured
- Check payment intent status in Stripe dashboard
- Review backend logs for payment errors

### Click Tracking Issues
- Verify API endpoints are accessible
- Check browser console for tracking errors
- Ensure campaign status is "active"
- Verify account has sufficient balance

### Analytics Not Showing
- Verify campaign_id is correct
- Check that clicks/impressions have been tracked
- Review database for campaign records

## Security Considerations

- All payments are processed securely through Stripe
- Click tracking includes IP address for fraud prevention
- Daily budget limits prevent overspending
- Balance checks prevent negative balances
- All transactions are logged for audit

## Key Differences from Package Model

| Feature | Package Model | Facebook-Style Model |
|---------|--------------|---------------------|
| Payment | Buy package upfront | Add funds to account |
| Duration | Fixed (monthly/yearly) | No expiration |
| Flexibility | Limited to package | Full control |
| Budget | Package-based | Per campaign |
| Refunds | Package-based | Balance-based |

## Future Enhancements

Potential improvements:
- A/B testing for campaigns
- Advanced targeting options
- Automated bid management
- Email notifications for low balance
- Integration with social media APIs
- Campaign scheduling
- Performance optimization suggestions
