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
