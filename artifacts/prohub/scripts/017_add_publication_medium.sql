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
