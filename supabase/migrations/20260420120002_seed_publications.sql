-- Seed Publications Data with AAM-audited circulation figures
-- All rates are publisher rates (client sees +20% markup)

-- Wire Services (Free)
INSERT INTO publications (name, description, audience, focus, geographic, frequency, circulation, publisher_cpm, is_free) VALUES
('PR Newswire', 'Press release distribution to media outlets', 'Journalists, media professionals', 'general', 'nationwide', 'Continuous', 500000, 0, true),
('Business Wire', 'Global news distribution and disclosure services', 'Media, investors, professionals', 'business', 'nationwide', 'Continuous', 450000, 0, true),
('GlobeNewswire', 'Corporate press release distribution', 'Investors, media, analysts', 'business', 'nationwide', 'Continuous', 400000, 0, true);

-- National Tech Publications
INSERT INTO publications (name, description, audience, focus, geographic, frequency, circulation, publisher_cpm) VALUES
('The Guardian Tech', 'Technology news and analysis', 'Tech enthusiasts, professionals', 'tech', 'international', 'Daily', 415000, 8.43),
('Business Insider', 'Business, tech, and financial news', 'Business professionals, executives', 'business', 'nationwide', 'Daily', 250000, 9.60),
('Forbes', 'Business, investing, technology, leadership', 'Business leaders, investors, entrepreneurs', 'business', 'nationwide', 'Biweekly (print) / Daily (digital)', 528897, 11.35),
('Mashable', 'Digital culture, social media, tech', 'Millennials, tech enthusiasts', 'tech', 'nationwide', 'Daily', 250000, 9.60),
('The Verge', 'Technology, science, art, culture', 'Tech enthusiasts, early adopters', 'tech', 'nationwide', 'Daily', 350000, 12.00),
('Ars Technica', 'Technology news and analysis', 'IT professionals, tech enthusiasts', 'tech', 'nationwide', 'Daily', 180000, 13.89),
('TechCrunch', 'Startup and technology news', 'Entrepreneurs, VCs, tech professionals', 'startup', 'nationwide', 'Daily', 850000, 4.12),
('VentureBeat', 'AI, gaming, and enterprise tech', 'Tech executives, developers', 'tech', 'nationwide', 'Daily', 600000, 8.33),
('Apartment Therapy', 'Home design and lifestyle', 'Homeowners, design enthusiasts', 'general', 'nationwide', 'Daily', 300000, 5.33),
('Fast Company', 'Business innovation and creativity', 'Business innovators, creatives', 'business', 'nationwide', 'Bimonthly (print) / Daily (digital)', 725000, 2.21),
('New York Times', 'Comprehensive news coverage', 'General audience, professionals', 'general', 'nationwide', 'Daily', 10320000, 0.97),
('Inc. Magazine', 'Small business, entrepreneurship, startups', 'Entrepreneurs, small business owners', 'startup', 'nationwide', 'Monthly (print) / Daily (digital)', 653189, 1.22),
('Product Hunt', 'New tech products and startups', 'Early adopters, tech enthusiasts', 'startup', 'nationwide', 'Daily', 400000, 0.00),
('Wired', 'Technology, culture, science', 'Tech enthusiasts, futurists', 'tech', 'nationwide', 'Monthly (print) / Daily (digital)', 521870, 13.41),
('MIT Technology Review', 'Emerging technology analysis', 'Scientists, engineers, tech leaders', 'science', 'international', 'Bimonthly (print) / Daily (digital)', 345000, 10.14),
('Curbed', 'Real estate and city news', 'Urban dwellers, real estate enthusiasts', 'general', 'nationwide', 'Daily', 280000, 17.86),
('Yahoo Finance', 'Financial news and market data', 'Investors, traders, finance professionals', 'business', 'nationwide', 'Continuous', 7000000, 0.06),
('Bloomberg', 'Financial, business, and market news', 'Finance professionals, executives', 'business', 'international', 'Continuous', 125000, 33.60),
('Wall Street Journal', 'Business, financial, economic news', 'Business leaders, investors, professionals', 'business', 'nationwide', 'Daily', 2834000, 2.47),
('USA Today', 'National general interest news', 'General audience nationwide', 'general', 'nationwide', 'Daily', 1621091, 2.96),
('Fortune', 'Business news and analysis', 'Business executives, entrepreneurs', 'business', 'nationwide', 'Monthly (print) / Daily (digital)', 850000, 7.06),
('Time', 'News, politics, entertainment, science', 'General audience, professionals', 'general', 'international', 'Weekly (print) / Daily (digital)', 1018199, 5.89),
('Entrepreneur', 'Entrepreneurship and small business', 'Entrepreneurs, startup founders', 'startup', 'nationwide', 'Monthly (print) / Daily (digital)', 650000, 3.08);

-- Regional Publications - West
INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, circulation, publisher_cpm) VALUES
('Freshhawk Journal', 'Silicon Valley tech news', 'Tech professionals, investors', 'tech', 'local', 'west', 'bay-area', 'Daily', 20000, 40.00),
('SFGate', 'San Francisco Bay Area news and culture', 'Bay Area residents', 'general', 'local', 'west', 'bay-area', 'Daily', 65000, 6.15),
('San Francisco Chronicle', 'San Francisco and Bay Area news, business, tech', 'Bay Area professionals', 'general', 'local', 'west', 'bay-area', 'Daily', 90000, 7.78),
('Arizona Republic', 'Phoenix metro area news', 'Phoenix residents', 'general', 'regional', 'west', 'phoenix', 'Daily', 75000, 10.67),
('Las Vegas Review-Journal', 'Las Vegas news, gaming, entertainment', 'Las Vegas residents', 'entertainment', 'regional', 'west', 'las-vegas', 'Daily', 83000, 9.64),
('Los Angeles Times', 'Los Angeles and Southern California news', 'Southern California residents', 'general', 'regional', 'west', 'los-angeles', 'Daily', 393019, 4.07),
('San Diego Union-Tribune', 'San Diego regional news', 'San Diego residents', 'general', 'regional', 'west', 'san-diego', 'Daily', 95000, 7.37),
('Seattle Times', 'Pacific Northwest news and tech', 'Seattle area residents', 'tech', 'regional', 'west', 'seattle', 'Daily', 213000, 6.10),
('Denver Post', 'Colorado and Rocky Mountain news', 'Colorado residents', 'general', 'regional', 'west', 'denver', 'Daily', 83000, 7.23),
('Portland Oregonian', 'Oregon and Pacific Northwest news', 'Oregon residents', 'general', 'regional', 'west', 'portland', 'Daily', 75000, 6.67);

-- Regional Publications - Midwest
INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, circulation, publisher_cpm) VALUES
('Indianapolis Star', 'Indianapolis and Indiana news', 'Indianapolis residents', 'general', 'regional', 'midwest', 'indianapolis', 'Daily', 40000, 17.50),
('Kansas City Star', 'Kansas City metro news and business', 'KC metro residents', 'general', 'regional', 'midwest', 'kansas-city', 'Daily', 38000, 18.42),
('St. Louis Post-Dispatch', 'St. Louis and Missouri news', 'St. Louis area residents', 'general', 'regional', 'midwest', 'st-louis', 'Daily', 72000, 9.72),
('Chicago Tribune', 'Chicago and Midwest news', 'Chicago area residents', 'general', 'regional', 'midwest', 'chicago', 'Daily', 275478, 4.36),
('Detroit Free Press', 'Detroit news, auto industry, sports', 'Detroit area residents', 'general', 'regional', 'midwest', 'detroit', 'Daily', 50000, 12.00),
('Star Tribune', 'Minneapolis-St. Paul news and business', 'Twin Cities residents', 'general', 'regional', 'midwest', 'minneapolis', 'Daily', 180000, 3.33),
('Cleveland Plain Dealer', 'Cleveland and Northeast Ohio news', 'Cleveland area residents', 'general', 'regional', 'midwest', 'cleveland', 'Daily', 45000, 17.78),
('Columbus Dispatch', 'Columbus and Central Ohio news', 'Columbus residents', 'general', 'regional', 'midwest', 'columbus', 'Daily', 45000, 13.33),
('Milwaukee Journal Sentinel', 'Milwaukee and Wisconsin news', 'Wisconsin residents', 'general', 'regional', 'midwest', 'milwaukee', 'Daily', 48000, 16.67);

-- Regional Publications - Northeast
INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, circulation, publisher_cpm) VALUES
('Philadelphia Inquirer', 'Philadelphia and Pennsylvania news', 'Philadelphia area residents', 'general', 'regional', 'northeast', 'philadelphia', 'Daily', 85000, 8.24),
('Pittsburgh Post-Gazette', 'Pittsburgh and Western Pennsylvania news', 'Pittsburgh area residents', 'general', 'regional', 'northeast', 'pittsburgh', 'Daily', 85000, 5.88),
('Boston Globe', 'Boston and New England news', 'Boston area residents', 'general', 'regional', 'northeast', 'boston', 'Daily', 226929, 5.29),
('Hartford Courant', 'Connecticut news and business', 'Connecticut residents', 'general', 'regional', 'northeast', 'hartford', 'Daily', 25000, 28.00),
('Newark Star-Ledger', 'New Jersey news', 'New Jersey residents', 'general', 'regional', 'northeast', 'newark', 'Daily', 75000, 10.67),
('Washington Post', 'Washington DC and national politics', 'DC area residents, political audience', 'general', 'regional', 'northeast', 'washington-dc', 'Daily', 2631000, 1.14),
('Baltimore Sun', 'Baltimore and Maryland news', 'Baltimore area residents', 'general', 'regional', 'northeast', 'baltimore', 'Daily', 65000, 9.23);

-- Regional Publications - South
INSERT INTO publications (name, description, audience, focus, geographic, region, locality, frequency, circulation, publisher_cpm) VALUES
('Tampa Bay Times', 'Tampa Bay area news', 'Tampa Bay residents', 'general', 'regional', 'south', 'tampa', 'Daily', 75000, 8.00),
('Orlando Sentinel', 'Orlando and Central Florida news', 'Central Florida residents', 'general', 'regional', 'south', 'orlando', 'Daily', 65000, 9.23),
('Miami Herald', 'South Florida news and Latin America', 'South Florida residents', 'general', 'regional', 'south', 'miami', 'Daily', 85000, 11.76),
('Atlanta Journal-Constitution', 'Atlanta and Georgia news', 'Atlanta area residents', 'general', 'regional', 'south', 'atlanta', 'Daily', 155000, 5.16),
('Charlotte Observer', 'Charlotte and Carolina news', 'Charlotte area residents', 'general', 'regional', 'south', 'charlotte', 'Daily', 70000, 10.00),
('Raleigh News & Observer', 'Raleigh and North Carolina news', 'Triangle area residents', 'general', 'regional', 'south', 'raleigh', 'Daily', 55000, 9.09),
('San Antonio Express-News', 'San Antonio news', 'San Antonio residents', 'general', 'regional', 'south', 'san-antonio', 'Daily', 50000, 14.00),
('Times-Picayune / NOLA.com', 'New Orleans and Louisiana news', 'New Orleans residents', 'general', 'regional', 'south', 'new-orleans', 'Daily', 40000, 17.50),
('Sacramento Bee', 'Sacramento and Central Valley news, politics', 'Sacramento area residents', 'general', 'regional', 'south', 'sacramento', 'Daily', 45000, 13.33),
('Houston Chronicle', 'Houston and Texas news, energy industry', 'Houston area residents', 'business', 'regional', 'south', 'houston', 'Daily', 270000, 4.44),
('Dallas Morning News', 'Dallas-Fort Worth and Texas news', 'Dallas area residents', 'general', 'regional', 'south', 'dallas', 'Daily', 175000, 5.14),
('Austin American-Statesman', 'Austin and Central Texas news, tech', 'Austin residents', 'tech', 'regional', 'south', 'austin', 'Daily', 65000, 9.23);

-- Now insert tiers for each publication
-- Wire Services (Free tiers)
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Standard Release', 'Standard press release distribution', 0 FROM publications WHERE name = 'PR Newswire';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Standard Release', 'Standard press release distribution', 0 FROM publications WHERE name = 'Business Wire';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Standard Release', 'Standard press release distribution', 0 FROM publications WHERE name = 'GlobeNewswire';

-- National Tech Publications Tiers
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 3500 FROM publications WHERE name = 'The Guardian Tech';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 1750 FROM publications WHERE name = 'The Guardian Tech';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 875 FROM publications WHERE name = 'The Guardian Tech';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 2000 FROM publications WHERE name = 'Business Insider';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 625 FROM publications WHERE name = 'Business Insider';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 500 FROM publications WHERE name = 'Business Insider';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'BrandVoice', 'Forbes BrandVoice sponsored content', 6000 FROM publications WHERE name = 'Forbes';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Contributor Mention', 'Mention in contributor article', 1250 FROM publications WHERE name = 'Forbes';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1500 FROM publications WHERE name = 'Forbes';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 2000 FROM publications WHERE name = 'Mashable';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 600 FROM publications WHERE name = 'Mashable';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 400 FROM publications WHERE name = 'Mashable';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 4200 FROM publications WHERE name = 'The Verge';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 1400 FROM publications WHERE name = 'The Verge';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 700 FROM publications WHERE name = 'The Verge';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 2500 FROM publications WHERE name = 'Ars Technica';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 800 FROM publications WHERE name = 'Ars Technica';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 500 FROM publications WHERE name = 'Ars Technica';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 3500 FROM publications WHERE name = 'TechCrunch';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 2917 FROM publications WHERE name = 'TechCrunch';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 875 FROM publications WHERE name = 'TechCrunch';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 5000 FROM publications WHERE name = 'VentureBeat';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 1500 FROM publications WHERE name = 'VentureBeat';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1000 FROM publications WHERE name = 'VentureBeat';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 1600 FROM publications WHERE name = 'Apartment Therapy';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 500 FROM publications WHERE name = 'Apartment Therapy';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 400 FROM publications WHERE name = 'Apartment Therapy';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 1600 FROM publications WHERE name = 'Fast Company';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 500 FROM publications WHERE name = 'Fast Company';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 400 FROM publications WHERE name = 'Fast Company';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 10000 FROM publications WHERE name = 'New York Times';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 5000 FROM publications WHERE name = 'New York Times';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 2500 FROM publications WHERE name = 'New York Times';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 800 FROM publications WHERE name = 'Inc. Magazine';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 400 FROM publications WHERE name = 'Inc. Magazine';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 200 FROM publications WHERE name = 'Inc. Magazine';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Featured Launch', 'Featured product launch placement', 0 FROM publications WHERE name = 'Product Hunt';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 7000 FROM publications WHERE name = 'Wired';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 2000 FROM publications WHERE name = 'Wired';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1750 FROM publications WHERE name = 'Wired';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 3500 FROM publications WHERE name = 'MIT Technology Review';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 1200 FROM publications WHERE name = 'MIT Technology Review';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 875 FROM publications WHERE name = 'MIT Technology Review';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 5000 FROM publications WHERE name = 'Curbed';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 1500 FROM publications WHERE name = 'Curbed';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1250 FROM publications WHERE name = 'Curbed';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 420 FROM publications WHERE name = 'Yahoo Finance';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Press Mention', 'Press release syndication', 175 FROM publications WHERE name = 'Yahoo Finance';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 4200 FROM publications WHERE name = 'Bloomberg';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Press Mention', 'Press release/news mention', 583 FROM publications WHERE name = 'Bloomberg';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 2000 FROM publications WHERE name = 'Bloomberg';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 7000 FROM publications WHERE name = 'Wall Street Journal';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 3500 FROM publications WHERE name = 'Wall Street Journal';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1750 FROM publications WHERE name = 'Wall Street Journal';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 4800 FROM publications WHERE name = 'USA Today';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 2000 FROM publications WHERE name = 'USA Today';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1200 FROM publications WHERE name = 'USA Today';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 6000 FROM publications WHERE name = 'Fortune';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 1800 FROM publications WHERE name = 'Fortune';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1500 FROM publications WHERE name = 'Fortune';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 6000 FROM publications WHERE name = 'Time';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 1800 FROM publications WHERE name = 'Time';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 1500 FROM publications WHERE name = 'Time';

INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Sponsored Article', 'Full sponsored article placement', 2000 FROM publications WHERE name = 'Entrepreneur';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Editorial Mention', 'Mention in editorial content', 650 FROM publications WHERE name = 'Entrepreneur';
INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
SELECT id, 'Display Banner', 'Display advertising placement', 500 FROM publications WHERE name = 'Entrepreneur';

-- Regional Publications Tiers (simplified - add basic tiers for all)
DO $$
DECLARE
    pub RECORD;
BEGIN
    FOR pub IN 
        SELECT id, name, circulation FROM publications 
        WHERE geographic IN ('regional', 'local') 
        AND NOT EXISTS (SELECT 1 FROM publication_tiers WHERE publication_id = publications.id)
    LOOP
        -- Sponsored Article tier
        INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
        VALUES (pub.id, 'Sponsored Article', 'Full sponsored article placement', 
            CASE 
                WHEN pub.circulation > 200000 THEN 1600
                WHEN pub.circulation > 100000 THEN 1200
                WHEN pub.circulation > 50000 THEN 800
                ELSE 500
            END
        );
        
        -- Editorial Mention tier
        INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
        VALUES (pub.id, 'Editorial Mention', 'Mention in editorial content',
            CASE 
                WHEN pub.circulation > 200000 THEN 600
                WHEN pub.circulation > 100000 THEN 450
                WHEN pub.circulation > 50000 THEN 300
                ELSE 200
            END
        );
        
        -- Display Banner tier
        INSERT INTO publication_tiers (publication_id, name, description, publisher_rate)
        VALUES (pub.id, 'Display Banner', 'Display advertising placement',
            CASE 
                WHEN pub.circulation > 200000 THEN 400
                WHEN pub.circulation > 100000 THEN 300
                WHEN pub.circulation > 50000 THEN 200
                ELSE 150
            END
        );
    END LOOP;
END $$;
