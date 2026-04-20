import { NextResponse } from 'next/server'

const MIGRATION_SQL = `
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

-- Publication tiers
CREATE TABLE IF NOT EXISTS publication_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  publisher_rate DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles
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
  geo_coverage TEXT,
  geo_regions TEXT[],
  geo_states TEXT[],
  geo_counties TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign publications
CREATE TABLE IF NOT EXISTS campaign_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES publication_tiers(id),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, publication_id, tier_id)
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES publication_tiers(id),
  price DECIMAL(10,2) NOT NULL,
  placement_type TEXT,
  timing TEXT DEFAULT 'standard',
  frequency TEXT DEFAULT 'once',
  preferred_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
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
  placement_type TEXT,
  timing TEXT DEFAULT 'standard',
  frequency TEXT DEFAULT 'once',
  preferred_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsroom posts
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

-- Campaign performance
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

-- Add medium and rate columns to publications
ALTER TABLE publications ADD COLUMN IF NOT EXISTS medium TEXT DEFAULT 'digital';
ALTER TABLE publications ADD COLUMN IF NOT EXISTS sponsored_rate NUMERIC;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS editorial_rate NUMERIC;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS contact_title TEXT;

-- Enable RLS
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsroom_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Publications are viewable by everyone" ON publications;
CREATE POLICY "Publications are viewable by everyone" ON publications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Publication tiers are viewable by everyone" ON publication_tiers;
CREATE POLICY "Publication tiers are viewable by everyone" ON publication_tiers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own campaigns" ON campaigns;
CREATE POLICY "Users can insert own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
CREATE POLICY "Users can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;
CREATE POLICY "Users can delete own campaigns" ON campaigns FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert to own cart" ON cart_items;
CREATE POLICY "Users can insert to own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete from own cart" ON cart_items;
CREATE POLICY "Users can delete from own cart" ON cart_items FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Newsroom posts are viewable by everyone" ON newsroom_posts;
CREATE POLICY "Newsroom posts are viewable by everyone" ON newsroom_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own newsroom posts" ON newsroom_posts;
CREATE POLICY "Users can insert own newsroom posts" ON newsroom_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own campaign performance" ON campaign_performance;
CREATE POLICY "Users can view own campaign performance" ON campaign_performance
  FOR SELECT USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Profile auto-create trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id, NEW.email,
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_publications_focus ON publications(focus);
CREATE INDEX IF NOT EXISTS idx_publications_geographic ON publications(geographic);
CREATE INDEX IF NOT EXISTS idx_publications_region ON publications(region);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_newsroom_posts_published_at ON newsroom_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_campaign ON campaign_performance(campaign_id);
`

// Run schema migration via Supabase's internal SQL endpoint
export async function POST(request: Request) {
  // Security: only allow with admin secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Split into individual statements for execution via pg_query RPC
  const statements = MIGRATION_SQL
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 5 && !s.startsWith('--'))

  const results: { stmt: string; ok: boolean; error?: string }[] = []

  for (const stmt of statements) {
    const sql = stmt.endsWith(';') ? stmt : stmt + ';'
    
    // Use the Supabase SQL execution via a custom function call
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    })
    
    const text = await res.text()
    results.push({
      stmt: sql.slice(0, 60),
      ok: res.ok,
      error: res.ok ? undefined : text.slice(0, 200),
    })
  }

  return NextResponse.json({ results })
}
