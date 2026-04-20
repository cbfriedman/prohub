-- Add geographic targeting columns to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_coverage TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_regions TEXT[]; -- Array of region codes
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_states TEXT[]; -- Array of state codes
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS geo_counties TEXT[]; -- Array of county codes
