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
