-- Add geographic targeting columns to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_coverage TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_regions TEXT[]; -- Array of region codes
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_states TEXT[]; -- Array of state codes
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_counties TEXT[]; -- Array of county codes
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
-- Add placement_type column to cart_items for storing 'sponsored' or 'editorial'
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS placement_type text;

-- Update the unique constraint to use publication_id and placement_type instead of tier_id
-- First drop the old constraint if it exists
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_publication_id_tier_id_key;

-- Add new unique constraint
ALTER TABLE cart_items ADD CONSTRAINT cart_items_user_publication_placement_unique 
  UNIQUE (user_id, publication_id, placement_type);

-- Make tier_id nullable since we'll use placement_type instead
ALTER TABLE cart_items ALTER COLUMN tier_id DROP NOT NULL;
-- Add scheduling columns to cart_items table
ALTER TABLE cart_items
ADD COLUMN IF NOT EXISTS timing TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'once',
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add scheduling columns to order_items table to persist after checkout
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS placement_type TEXT,
ADD COLUMN IF NOT EXISTS timing TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'once',
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add publisher contact info to publications
ALTER TABLE publications
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_title TEXT;

-- Update some sample publications with contact info
UPDATE publications SET 
  contact_name = 'Sarah Johnson',
  contact_email = 'sjohnson@sfchronicle.com', 
  contact_phone = '(415) 555-0123',
  contact_title = 'Advertising Director'
WHERE name ILIKE '%San Francisco Chronicle%';

UPDATE publications SET 
  contact_name = 'Mike Chen',
  contact_email = 'mchen@freshhawk.com', 
  contact_phone = '(408) 555-0456',
  contact_title = 'Tech Editor'
WHERE name ILIKE '%Freshhawk%';

UPDATE publications SET 
  contact_name = 'Emily Davis',
  contact_email = 'press@sfgate.com', 
  contact_phone = '(415) 555-0789',
  contact_title = 'Press Relations'
WHERE name ILIKE '%SFGate%';
-- Update publications with frequency data
UPDATE publications SET frequency = 'daily' WHERE name ILIKE '%Chronicle%' OR name ILIKE '%Times%' OR name ILIKE '%Post%';
UPDATE publications SET frequency = 'weekly' WHERE name ILIKE '%Weekly%' OR name ILIKE '%Journal%';
UPDATE publications SET frequency = 'monthly' WHERE name ILIKE '%Magazine%' OR name ILIKE '%Monthly%';
UPDATE publications SET frequency = 'daily' WHERE name ILIKE '%SFGate%' OR name ILIKE '%Gate%';
UPDATE publications SET frequency = 'online' WHERE name ILIKE '%TechCrunch%' OR name ILIKE '%Verge%' OR name ILIKE '%Wired%';

-- Set default frequency for any remaining publications without one
UPDATE publications SET frequency = 'online' WHERE frequency IS NULL;
-- Add medium column to publications to distinguish print vs digital editions
ALTER TABLE publications ADD COLUMN IF NOT EXISTS medium text DEFAULT 'digital';

-- Add sponsored_rate and editorial_rate columns for explicit pricing per medium
ALTER TABLE publications ADD COLUMN IF NOT EXISTS sponsored_rate numeric;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS editorial_rate numeric;

-- Update existing publications with default rates based on circulation and CPM
UPDATE publications 
SET 
  sponsored_rate = COALESCE(circulation * publisher_cpm / 1000, 500),
  editorial_rate = COALESCE(circulation * publisher_cpm / 1000 * 0.6, 300)
WHERE sponsored_rate IS NULL;

-- Create digital editions for major publications that have both print and digital
-- These will be separate rows with different frequencies and rates

-- San Francisco Chronicle - Print (Daily) already exists, add Digital (Continuous)
INSERT INTO publications (name, description, geographic, region, locality, focus, audience, circulation, publisher_cpm, frequency, medium, sponsored_rate, editorial_rate, contact_name, contact_email, contact_phone, contact_title)
SELECT 
  name || ' Digital',
  description,
  geographic,
  region,
  locality,
  focus,
  audience,
  circulation * 3,  -- Digital typically has higher reach
  publisher_cpm * 0.7,  -- Digital CPM typically lower
  'continuous',
  'digital',
  sponsored_rate * 0.8,  -- Digital rates typically lower
  editorial_rate * 0.8,
  contact_name,
  contact_email,
  contact_phone,
  contact_title
FROM publications 
WHERE name = 'San Francisco Chronicle' AND medium = 'digital'
ON CONFLICT DO NOTHING;

-- Update existing SF Chronicle to be print
UPDATE publications SET medium = 'print', frequency = 'daily' WHERE name = 'San Francisco Chronicle' AND medium = 'digital';

-- Add more print/digital splits for common publications
-- Entrepreneur Magazine - Monthly Print, Daily Digital
INSERT INTO publications (name, description, geographic, frequency, medium, circulation, publisher_cpm, focus, audience, sponsored_rate, editorial_rate)
VALUES 
  ('Entrepreneur Magazine', 'Entrepreneurship and small business coverage', 'nationwide', 'monthly', 'print', 500000, 25, 'business', 'Entrepreneurs, small business owners, startups', 12500, 7500),
  ('Entrepreneur Digital', 'Entrepreneurship and small business coverage - online edition', 'nationwide', 'daily', 'digital', 2000000, 15, 'business', 'Entrepreneurs, small business owners, startups', 8000, 4800)
ON CONFLICT DO NOTHING;

-- Forbes - Monthly Print, Daily Digital
INSERT INTO publications (name, description, geographic, frequency, medium, circulation, publisher_cpm, focus, audience, sponsored_rate, editorial_rate)
VALUES 
  ('Forbes Magazine', 'Business, investing, technology, entrepreneurship', 'nationwide', 'monthly', 'print', 900000, 35, 'business', 'Business executives, investors, entrepreneurs', 31500, 18900),
  ('Forbes Digital', 'Business, investing, technology, entrepreneurship - online edition', 'nationwide', 'daily', 'digital', 5000000, 20, 'business', 'Business executives, investors, entrepreneurs', 20000, 12000)
ON CONFLICT DO NOTHING;

-- Inc Magazine - Monthly Print, Daily Digital
INSERT INTO publications (name, description, geographic, frequency, medium, circulation, publisher_cpm, focus, audience, sponsored_rate, editorial_rate)
VALUES 
  ('Inc. Magazine', 'Growing companies and business innovation', 'nationwide', 'monthly', 'print', 700000, 28, 'business', 'Business owners, executives, entrepreneurs', 19600, 11760),
  ('Inc. Digital', 'Growing companies and business innovation - online edition', 'nationwide', 'daily', 'digital', 3000000, 16, 'business', 'Business owners, executives, entrepreneurs', 12000, 7200)
ON CONFLICT DO NOTHING;

-- Wired - Monthly Print, Daily Digital
INSERT INTO publications (name, description, geographic, frequency, medium, circulation, publisher_cpm, focus, audience, sponsored_rate, editorial_rate)
VALUES 
  ('Wired Magazine', 'Technology, science, culture, and business', 'nationwide', 'monthly', 'print', 800000, 30, 'tech', 'Tech enthusiasts, innovators, early adopters', 24000, 14400),
  ('Wired Digital', 'Technology, science, culture, and business - online edition', 'nationwide', 'continuous', 'digital', 4500000, 18, 'tech', 'Tech enthusiasts, innovators, early adopters', 16200, 9720)
ON CONFLICT DO NOTHING;

-- Update existing tech publications to specify medium
UPDATE publications SET medium = 'digital' WHERE name IN ('TechCrunch', 'Ars Technica', 'SFGate', 'Freshhawk Journal') AND medium IS NULL;
UPDATE publications SET medium = 'print' WHERE frequency = 'weekly' AND medium IS NULL;
UPDATE publications SET medium = 'digital' WHERE frequency IN ('daily', 'continuous', 'online') AND medium IS NULL;
-- Fix publications that have combined print/digital frequencies
-- Split them into separate rows with their own frequencies and rates

-- First, update the original rows to be the PRINT versions
UPDATE publications 
SET 
  medium = 'print',
  frequency = 'monthly',
  name = name || ' (Print)'
WHERE name = 'Entrepreneur' AND medium IS NULL;

UPDATE publications 
SET 
  medium = 'print',
  frequency = 'bimonthly',
  name = name || ' (Print)'
WHERE name = 'Fast Company' AND medium IS NULL;

UPDATE publications 
SET 
  medium = 'print',
  frequency = 'biweekly',
  name = name || ' (Print)'
WHERE name = 'Forbes' AND medium IS NULL;

UPDATE publications 
SET 
  medium = 'print',
  frequency = 'monthly',
  name = name || ' (Print)'
WHERE name = 'Fortune' AND medium IS NULL;

UPDATE publications 
SET 
  medium = 'print',
  frequency = 'monthly',
  name = name || ' (Print)'
WHERE name = 'Wired' AND medium IS NULL;

UPDATE publications 
SET 
  medium = 'print',
  frequency = 'monthly',
  name = name || ' (Print)'
WHERE name = 'Inc.' AND medium IS NULL;

-- Now insert the DIGITAL versions as new rows
INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, medium, circulation, publisher_cpm, is_free)
SELECT 
  REPLACE(name, ' (Print)', '') || ' (Digital)',
  description,
  audience,
  focus,
  geographic,
  region,
  locality,
  'daily',
  'digital',
  circulation * 3,  -- Digital typically has higher reach
  publisher_cpm * 0.6,  -- Digital rates are typically lower
  is_free
FROM publications
WHERE name LIKE 'Entrepreneur (Print)%'
  AND NOT EXISTS (SELECT 1 FROM publications WHERE name = 'Entrepreneur (Digital)');

INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, medium, circulation, publisher_cpm, is_free)
SELECT 
  REPLACE(name, ' (Print)', '') || ' (Digital)',
  description,
  audience,
  focus,
  geographic,
  region,
  locality,
  'daily',
  'digital',
  circulation * 3,
  publisher_cpm * 0.6,
  is_free
FROM publications
WHERE name LIKE 'Fast Company (Print)%'
  AND NOT EXISTS (SELECT 1 FROM publications WHERE name = 'Fast Company (Digital)');

INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, medium, circulation, publisher_cpm, is_free)
SELECT 
  REPLACE(name, ' (Print)', '') || ' (Digital)',
  description,
  audience,
  focus,
  geographic,
  region,
  locality,
  'daily',
  'digital',
  circulation * 3,
  publisher_cpm * 0.6,
  is_free
FROM publications
WHERE name LIKE 'Forbes (Print)%'
  AND NOT EXISTS (SELECT 1 FROM publications WHERE name = 'Forbes (Digital)');

INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, medium, circulation, publisher_cpm, is_free)
SELECT 
  REPLACE(name, ' (Print)', '') || ' (Digital)',
  description,
  audience,
  focus,
  geographic,
  region,
  locality,
  'daily',
  'digital',
  circulation * 3,
  publisher_cpm * 0.6,
  is_free
FROM publications
WHERE name LIKE 'Fortune (Print)%'
  AND NOT EXISTS (SELECT 1 FROM publications WHERE name = 'Fortune (Digital)');

INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, medium, circulation, publisher_cpm, is_free)
SELECT 
  REPLACE(name, ' (Print)', '') || ' (Digital)',
  description,
  audience,
  focus,
  geographic,
  region,
  locality,
  'continuous',
  'digital',
  circulation * 3,
  publisher_cpm * 0.6,
  is_free
FROM publications
WHERE name LIKE 'Wired (Print)%'
  AND NOT EXISTS (SELECT 1 FROM publications WHERE name = 'Wired (Digital)');

INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, medium, circulation, publisher_cpm, is_free)
SELECT 
  REPLACE(name, ' (Print)', '') || ' (Digital)',
  description,
  audience,
  focus,
  geographic,
  region,
  locality,
  'daily',
  'digital',
  circulation * 3,
  publisher_cpm * 0.6,
  is_free
FROM publications
WHERE name LIKE 'Inc. (Print)%'
  AND NOT EXISTS (SELECT 1 FROM publications WHERE name = 'Inc. (Digital)');

-- Clean up any rows from previous migration attempts that have duplicate naming
DELETE FROM publications WHERE name LIKE '%Magazine (Monthly Print)%';
DELETE FROM publications WHERE name LIKE '%Digital (Daily)%';
DELETE FROM publications WHERE name LIKE '%Digital (Continuous)%';

-- Update any remaining publications without medium to be digital
UPDATE publications SET medium = 'digital' WHERE medium IS NULL;
UPDATE publications SET frequency = 'daily' WHERE frequency LIKE '%/%';
