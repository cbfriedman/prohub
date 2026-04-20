-- Update publications with frequency data
UPDATE publications SET frequency = 'daily' WHERE name ILIKE '%Chronicle%' OR name ILIKE '%Times%' OR name ILIKE '%Post%';
UPDATE publications SET frequency = 'weekly' WHERE name ILIKE '%Weekly%' OR name ILIKE '%Journal%';
UPDATE publications SET frequency = 'monthly' WHERE name ILIKE '%Magazine%' OR name ILIKE '%Monthly%';
UPDATE publications SET frequency = 'daily' WHERE name ILIKE '%SFGate%' OR name ILIKE '%Gate%';
UPDATE publications SET frequency = 'online' WHERE name ILIKE '%TechCrunch%' OR name ILIKE '%Verge%' OR name ILIKE '%Wired%';

-- Set default frequency for any remaining publications without one
UPDATE publications SET frequency = 'online' WHERE frequency IS NULL;
