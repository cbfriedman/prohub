-- Add performance tracking table for campaigns
CREATE TABLE IF NOT EXISTS campaign_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL,
  publication_name TEXT NOT NULL,
  placement_type TEXT NOT NULL CHECK (placement_type IN ('sponsored', 'editorial')),
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  circulation INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  cpm DECIMAL(10,4) GENERATED ALWAYS AS (CASE WHEN impressions > 0 THEN (cost / impressions) * 1000 ELSE 0 END) STORED,
  ctr DECIMAL(5,4) GENERATED ALWAYS AS (CASE WHEN impressions > 0 THEN clicks::decimal / impressions ELSE 0 END) STORED,
  conversion_rate DECIMAL(5,4) GENERATED ALWAYS AS (CASE WHEN clicks > 0 THEN conversions::decimal / clicks ELSE 0 END) STORED,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_campaign_performance_campaign ON campaign_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_publication ON campaign_performance(publication_id);

-- Enable RLS
ALTER TABLE campaign_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own campaign performance" ON campaign_performance
  FOR SELECT USING (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own campaign performance" ON campaign_performance
  FOR INSERT WITH CHECK (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own campaign performance" ON campaign_performance
  FOR UPDATE USING (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );
