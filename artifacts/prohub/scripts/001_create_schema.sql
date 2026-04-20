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
