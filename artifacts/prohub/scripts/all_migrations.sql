-- PR Hub Database Schema
-- Tables for publications, campaigns, cart items, and orders

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  audience TEXT,
  focus TEXT NOT NULL CHECK (focus IN ('tech', 'business', 'entertainment', 'general', 'science', 'startup')),
  geographic TEXT NOT NULL CHECK (geographic IN ('nationwide', 'regional', 'local', 'international')),
  region TEXT,
  locality TEXT,
  frequency TEXT,
  circulation INTEGER NOT NULL DEFAULT 0,
  publisher_cpm DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publication tiers (rate card options)
CREATE TABLE IF NOT EXISTS publication_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  publisher_rate DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (linked to Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'submitted', 'published')),
  target_audience TEXT,
  key_messages TEXT,
  press_release_content TEXT,
  video_script_content TEXT,
  publish_to_newsroom BOOLEAN DEFAULT FALSE,
  youtube_url TEXT,
  total_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign publications (selected publications for a campaign)
CREATE TABLE IF NOT EXISTS campaign_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES publication_tiers(id),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, publication_id, tier_id)
);

-- Cart items (temporary before checkout)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES publication_tiers(id),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, publication_id, tier_id)
);

-- Orders (completed purchases)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id),
  tier_id UUID REFERENCES publication_tiers(id),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsroom posts (published press releases)
CREATE TABLE IF NOT EXISTS newsroom_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  youtube_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsroom_posts ENABLE ROW LEVEL SECURITY;

-- Publications and tiers are public read
CREATE POLICY "Publications are viewable by everyone" ON publications FOR SELECT USING (true);
CREATE POLICY "Publication tiers are viewable by everyone" ON publication_tiers FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON campaigns FOR DELETE USING (auth.uid() = user_id);

-- Campaign publications policies
CREATE POLICY "Users can view own campaign publications" ON campaign_publications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_publications.campaign_id AND campaigns.user_id = auth.uid()));
CREATE POLICY "Users can insert own campaign publications" ON campaign_publications FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_publications.campaign_id AND campaigns.user_id = auth.uid()));
CREATE POLICY "Users can delete own campaign publications" ON campaign_publications FOR DELETE 
  USING (EXISTS (SELECT 1 FROM campaigns WHERE campaigns.id = campaign_publications.campaign_id AND campaigns.user_id = auth.uid()));

-- Cart policies
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from own cart" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Newsroom posts are public read, but only authors can modify
CREATE POLICY "Newsroom posts are viewable by everyone" ON newsroom_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own newsroom posts" ON newsroom_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own newsroom posts" ON newsroom_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own newsroom posts" ON newsroom_posts FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE((NEW.raw_user_meta_data ->> 'is_admin')::boolean, FALSE)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_publications_focus ON publications(focus);
CREATE INDEX IF NOT EXISTS idx_publications_geographic ON publications(geographic);
CREATE INDEX IF NOT EXISTS idx_publications_region ON publications(region);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_newsroom_posts_published_at ON newsroom_posts(published_at DESC);
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
