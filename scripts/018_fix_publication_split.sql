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
