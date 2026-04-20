import type { Publication } from '@/lib/types'

export const MARKUP_PERCENTAGE = 0.20 // 20% markup

export function applyMarkup(rate: number, roundToWhole: boolean = false): number {
  const result = rate * (1 + MARKUP_PERCENTAGE)
  return roundToWhole ? Math.round(result) : Math.round(result * 100) / 100
}

// CPM = Cost Per Thousand (Mille) impressions
// Formula: CPM = (Ad Rate / Circulation) × 1,000
export function calculateCpm(rate: number, circulation: number): number {
  if (circulation === 0) return 0
  return (rate / circulation) * 1000
}

// Format circulation for display
export function formatCirculation(circulation: number): string {
  if (circulation >= 1000000) {
    return `${(circulation / 1000000).toFixed(1)}M`
  } else if (circulation >= 1000) {
    return `${(circulation / 1000).toFixed(0)}K`
  }
  return circulation.toString()
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Regions and localities for filtering
export const regions = {
  west: {
    name: 'West',
    states: ['CA', 'WA', 'OR', 'NV', 'AZ', 'UT', 'CO', 'NM', 'HI', 'AK'],
    localities: {
      'bay-area': { name: 'San Francisco Bay Area', state: 'CA' },
      'los-angeles': { name: 'Los Angeles Metro', state: 'CA' },
      'san-diego': { name: 'San Diego', state: 'CA' },
      'sacramento': { name: 'Sacramento', state: 'CA' },
      'seattle': { name: 'Seattle Metro', state: 'WA' },
      'portland': { name: 'Portland', state: 'OR' },
      'phoenix': { name: 'Phoenix Metro', state: 'AZ' },
      'denver': { name: 'Denver Metro', state: 'CO' },
      'las-vegas': { name: 'Las Vegas', state: 'NV' },
    }
  },
  midwest: {
    name: 'Midwest',
    states: ['IL', 'OH', 'MI', 'IN', 'WI', 'MN', 'IA', 'MO', 'KS', 'NE', 'SD', 'ND'],
    localities: {
      'chicago': { name: 'Chicago Metro', state: 'IL' },
      'detroit': { name: 'Detroit Metro', state: 'MI' },
      'minneapolis': { name: 'Minneapolis-St. Paul', state: 'MN' },
      'cleveland': { name: 'Cleveland', state: 'OH' },
      'columbus': { name: 'Columbus', state: 'OH' },
      'indianapolis': { name: 'Indianapolis', state: 'IN' },
      'milwaukee': { name: 'Milwaukee', state: 'WI' },
      'kansas-city': { name: 'Kansas City', state: 'MO' },
      'st-louis': { name: 'St. Louis', state: 'MO' },
    }
  },
  northeast: {
    name: 'Northeast',
    states: ['NY', 'PA', 'NJ', 'MA', 'CT', 'NH', 'VT', 'ME', 'RI'],
    localities: {
      'new-york': { name: 'New York City Metro', state: 'NY' },
      'boston': { name: 'Boston Metro', state: 'MA' },
      'philadelphia': { name: 'Philadelphia Metro', state: 'PA' },
      'pittsburgh': { name: 'Pittsburgh', state: 'PA' },
      'newark': { name: 'Newark/North Jersey', state: 'NJ' },
      'hartford': { name: 'Hartford', state: 'CT' },
      'providence': { name: 'Providence', state: 'RI' },
    }
  },
  south: {
    name: 'South',
    states: ['TX', 'FL', 'GA', 'NC', 'VA', 'TN', 'SC', 'AL', 'LA', 'KY', 'OK', 'AR', 'MS', 'WV', 'MD', 'DC'],
    localities: {
      'houston': { name: 'Houston Metro', state: 'TX' },
      'dallas': { name: 'Dallas-Fort Worth', state: 'TX' },
      'austin': { name: 'Austin', state: 'TX' },
      'san-antonio': { name: 'San Antonio', state: 'TX' },
      'miami': { name: 'Miami-Fort Lauderdale', state: 'FL' },
      'tampa': { name: 'Tampa Bay', state: 'FL' },
      'orlando': { name: 'Orlando', state: 'FL' },
      'atlanta': { name: 'Atlanta Metro', state: 'GA' },
      'charlotte': { name: 'Charlotte', state: 'NC' },
      'raleigh': { name: 'Raleigh-Durham', state: 'NC' },
      'nashville': { name: 'Nashville', state: 'TN' },
      'washington-dc': { name: 'Washington D.C. Metro', state: 'DC' },
      'baltimore': { name: 'Baltimore', state: 'MD' },
      'new-orleans': { name: 'New Orleans', state: 'LA' },
    }
  },
}

export type RegionKey = keyof typeof regions
export type LocalityKey = string

// =============================================================================
// PUBLICATIONS DATABASE
// Circulation: AAM (Alliance for Audited Media) audited data - PRINT + DIGITAL COMBINED
// Sources: AAM Magazine Media Intelligence (July-December 2025)
//          AAM News Media Intelligence (April-September 2025)
// PR Ad Rates: Based on industry research for guaranteed placement pricing
// All client-facing rates include 20% markup applied via applyMarkup()
// =============================================================================

export const publications: Publication[] = [
  // ============================================
  // TIER 1: PREMIUM BUSINESS PUBLICATIONS
  // ============================================
  {
    id: 'forbes',
    name: 'Forbes',
    description: 'Business, investing, technology, entrepreneurship',
    audience: 'C-suite executives, entrepreneurs, high-net-worth individuals',
    focus: 'business',
    geographic: 'international',
    frequency: 'Bi-monthly (print) / Daily (digital)',
    circulation: 528897, // AAM July-Dec 2025
    publisherCpm: 0, // Calculated dynamically
    tiers: [
      { id: 'brandvoice', name: 'BrandVoice Article', publisherRate: 5000, reach: '529K impressions', description: 'Sponsored content on Forbes' },
      { id: 'contributor', name: 'Contributor Mention', publisherRate: 1250, reach: '250K impressions', description: 'Mentioned in contributor article' },
      { id: 'display', name: 'Display Banner', publisherRate: 2500, reach: '400K impressions', description: 'Premium display advertising' },
    ]
  },
  {
    id: 'fortune',
    name: 'Fortune',
    description: 'Global business, corporate leadership, Fortune 500',
    audience: 'C-suite executives, corporate leaders, investors',
    focus: 'business',
    geographic: 'international',
    frequency: 'Monthly (print) / Daily (digital)',
    circulation: 509498, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 4500, reach: '509K impressions', description: 'Sponsored content placement' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1500, reach: '300K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 2000, reach: '400K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'bloomberg-businessweek',
    name: 'Bloomberg Businessweek',
    description: 'Business news, finance, markets, economics',
    audience: 'Financial professionals, investors, executives',
    focus: 'business',
    geographic: 'international',
    frequency: 'Weekly',
    circulation: 204477, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Content', publisherRate: 3500, reach: '204K impressions', description: 'Premium sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 700, reach: '100K impressions', description: 'Editorial mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1800, reach: '180K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'wall-street-journal',
    name: 'Wall Street Journal',
    description: 'Financial news, business, economics, politics',
    audience: 'Finance professionals, investors, business leaders',
    focus: 'business',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 475040, // AAM Apr-Sep 2025 (Sunday print+digital)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 5800, reach: '475K impressions', description: 'WSJ sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 2900, reach: '300K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 3500, reach: '400K impressions', description: 'Premium display' },
    ]
  },
  {
    id: 'barrons',
    name: "Barron's",
    description: 'Financial investing and market analysis',
    audience: 'Investors, wealth managers, financial advisors',
    focus: 'business',
    geographic: 'nationwide',
    frequency: 'Weekly',
    circulation: 109832, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 3200, reach: '110K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1200, reach: '70K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1500, reach: '90K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'harvard-business-review',
    name: 'Harvard Business Review',
    description: 'Management, leadership, and business strategy',
    audience: 'Executives, managers, business academics',
    focus: 'business',
    geographic: 'international',
    frequency: 'Bi-monthly',
    circulation: 318354, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 4000, reach: '318K impressions', description: 'Thought leadership content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1800, reach: '200K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 2200, reach: '280K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'economist',
    name: 'The Economist',
    description: 'International news, politics, business, finance',
    audience: 'Global business leaders, policy makers, intellectuals',
    focus: 'business',
    geographic: 'international',
    frequency: 'Weekly',
    circulation: 549111, // AAM July-Dec 2025 (North America)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 5500, reach: '549K impressions', description: 'Premium sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 2200, reach: '350K impressions', description: 'Press coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 2800, reach: '450K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'inc-magazine',
    name: 'Inc. Magazine',
    description: 'Small business, entrepreneurship, startups',
    audience: 'Entrepreneurs, small business owners, startup founders',
    focus: 'startup',
    geographic: 'nationwide',
    frequency: 'Monthly (print) / Daily (digital)',
    circulation: 653189, // AAM (most recent available)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 800, reach: '653K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 400, reach: '400K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 500, reach: '500K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Entrepreneurship, business ideas, growth strategies',
    audience: 'Entrepreneurs, small business owners',
    focus: 'startup',
    geographic: 'nationwide',
    frequency: 'Monthly (print) / Daily (digital)',
    circulation: 322415, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1200, reach: '322K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 500, reach: '200K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 600, reach: '250K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'fast-company',
    name: 'Fast Company',
    description: 'Innovation, business, and design',
    audience: 'Creative professionals, innovators, business leaders',
    focus: 'business',
    geographic: 'nationwide',
    frequency: 'Bi-monthly (print) / Daily (digital)',
    circulation: 750000, // Estimated print readership
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2500, reach: '750K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1000, reach: '450K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1200, reach: '600K impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // TIER 2: TECHNOLOGY PUBLICATIONS
  // ============================================
  {
    id: 'wired',
    name: 'Wired',
    description: 'Technology, science, culture, and the future',
    audience: 'Tech enthusiasts, futurists, early adopters',
    focus: 'tech',
    geographic: 'international',
    frequency: 'Monthly (print) / Daily (digital)',
    circulation: 521870, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 3000, reach: '522K impressions', description: 'Premium sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1200, reach: '350K impressions', description: 'Press coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1500, reach: '450K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'mit-technology-review',
    name: 'MIT Technology Review',
    description: 'Emerging technologies and their impact',
    audience: 'Scientists, engineers, tech executives',
    focus: 'science',
    geographic: 'international',
    frequency: 'Bi-monthly (print) / Daily (digital)',
    circulation: 214652, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2500, reach: '215K impressions', description: 'Premium sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1000, reach: '140K impressions', description: 'Press coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1200, reach: '180K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'ieee-spectrum',
    name: 'IEEE Spectrum',
    description: 'Engineering, technology, and science',
    audience: 'Engineers, technologists, researchers',
    focus: 'science',
    geographic: 'international',
    frequency: 'Monthly',
    circulation: 391382, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1800, reach: '391K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 700, reach: '250K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 900, reach: '320K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    description: 'Startup and technology news, funding announcements',
    audience: 'Tech entrepreneurs, VCs, developers',
    focus: 'startup',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 8500000, // ~8.5M monthly unique visitors
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 3750, reach: '8.5M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 2500, reach: '5M impressions', description: 'Press coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1800, reach: '6M impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    description: 'Technology, science, art, and culture',
    audience: 'Tech consumers, early adopters, gadget enthusiasts',
    focus: 'tech',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 12000000, // ~12M monthly unique visitors
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2800, reach: '12M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1100, reach: '7M impressions', description: 'Press coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1300, reach: '9M impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'mashable',
    name: 'Mashable',
    description: 'Digital culture, social media, tech, entertainment',
    audience: 'Digital natives, social media users, tech consumers',
    focus: 'tech',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 16000000, // ~16M monthly unique visitors
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2000, reach: '16M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 800, reach: '10M impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1000, reach: '12M impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'venturebeat',
    name: 'VentureBeat',
    description: 'AI, machine learning, and enterprise technology',
    audience: 'Tech executives, AI professionals, enterprise IT',
    focus: 'tech',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 4500000, // ~4.5M monthly unique visitors
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 4200, reach: '4.5M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1800, reach: '2.5M impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 2000, reach: '3.5M impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'ars-technica',
    name: 'Ars Technica',
    description: 'In-depth technology news and analysis',
    audience: 'IT professionals, engineers, tech decision makers',
    focus: 'tech',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 5000000, // ~5M monthly unique visitors
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2150, reach: '5M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 900, reach: '3M impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1200, reach: '4M impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'product-hunt',
    name: 'Product Hunt',
    description: 'New tech products and startups',
    audience: 'Early adopters, makers, startup founders',
    focus: 'startup',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 4000000, // ~4M monthly unique visitors
    publisherCpm: 0,
    isFree: true,
    tiers: [
      { id: 'launch', name: 'Product Launch', publisherRate: 0, reach: '4M+ potential', description: 'Free product launch listing' },
    ]
  },

  // ============================================
  // TIER 3: MAJOR NEWS OUTLETS
  // ============================================
  {
    id: 'new-york-times',
    name: 'New York Times',
    description: 'Breaking news, politics, business, culture',
    audience: 'Educated professionals, policy makers',
    focus: 'general',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 575964, // AAM Apr-Sep 2025 (Sunday print+digital)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Paid Post', publisherRate: 8500, reach: '576K impressions', description: 'NYT Paid Post' },
      { id: 'mention', name: 'Press Mention', publisherRate: 4000, reach: '400K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 5000, reach: '500K impressions', description: 'Premium display' },
    ]
  },
  {
    id: 'washington-post',
    name: 'Washington Post',
    description: 'Politics, government, national and world news',
    audience: 'Policy makers, political professionals, educated readers',
    focus: 'general',
    geographic: 'international',
    frequency: 'Daily',
    circulation: 136974, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Content', publisherRate: 6000, reach: '137K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 2500, reach: '90K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 3000, reach: '120K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'usa-today',
    name: 'USA Today',
    description: 'National news, sports, entertainment, lifestyle',
    audience: 'General American public',
    focus: 'general',
    geographic: 'nationwide',
    frequency: 'Daily',
    circulation: 114601, // AAM Apr-Sep 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 3300, reach: '115K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 1500, reach: '75K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1800, reach: '100K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'the-atlantic',
    name: 'The Atlantic',
    description: 'Politics, culture, business, science, technology',
    audience: 'Educated professionals, policy makers',
    focus: 'general',
    geographic: 'nationwide',
    frequency: 'Monthly (print) / Daily (digital)',
    circulation: 1459090, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 3800, reach: '1.5M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1500, reach: '900K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1800, reach: '1.2M impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'time',
    name: 'Time',
    description: 'News, politics, health, and culture',
    audience: 'General public, educated readers',
    focus: 'general',
    geographic: 'international',
    frequency: 'Weekly (print) / Daily (digital)',
    circulation: 1018199, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 4200, reach: '1M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1800, reach: '650K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 2000, reach: '850K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'new-yorker',
    name: 'The New Yorker',
    description: 'Culture, politics, commentary, fiction',
    audience: 'Urban professionals, intellectuals, culture enthusiasts',
    focus: 'entertainment',
    geographic: 'nationwide',
    frequency: 'Weekly',
    circulation: 1302909, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 4500, reach: '1.3M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 2000, reach: '850K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 2200, reach: '1.1M impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // TIER 4: ENTERTAINMENT & LIFESTYLE
  // ============================================
  {
    id: 'rolling-stone',
    name: 'Rolling Stone',
    description: 'Music, culture, and politics',
    audience: 'Music fans, cultural enthusiasts',
    focus: 'entertainment',
    geographic: 'international',
    frequency: 'Monthly (print) / Daily (digital)',
    circulation: 415792, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2800, reach: '416K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1100, reach: '270K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1300, reach: '350K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'variety',
    name: 'Variety',
    description: 'Entertainment industry news',
    audience: 'Entertainment professionals, industry insiders',
    focus: 'entertainment',
    geographic: 'international',
    frequency: 'Weekly (print) / Daily (digital)',
    circulation: 75784, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 3500, reach: '76K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 1500, reach: '50K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1800, reach: '65K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'hollywood-reporter',
    name: 'The Hollywood Reporter',
    description: 'Film, TV, and entertainment business news',
    audience: 'Entertainment industry professionals',
    focus: 'entertainment',
    geographic: 'international',
    frequency: 'Weekly (print) / Daily (digital)',
    circulation: 86287, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 3200, reach: '86K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 1400, reach: '55K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1600, reach: '75K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'billboard',
    name: 'Billboard',
    description: 'Music industry news and charts',
    audience: 'Music industry professionals, artists',
    focus: 'entertainment',
    geographic: 'international',
    frequency: 'Weekly',
    circulation: 46500, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2500, reach: '47K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1000, reach: '30K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1200, reach: '40K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'people',
    name: 'People',
    description: 'Celebrity news and human interest',
    audience: 'General public, celebrity followers',
    focus: 'entertainment',
    geographic: 'nationwide',
    frequency: 'Weekly',
    circulation: 2241069, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 4500, reach: '2.2M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 2000, reach: '1.4M impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 2400, reach: '1.8M impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // TIER 5: SCIENCE & EDUCATION
  // ============================================
  {
    id: 'national-geographic',
    name: 'National Geographic',
    description: 'Science, exploration, and natural world',
    audience: 'Nature enthusiasts, travelers, educators',
    focus: 'science',
    geographic: 'international',
    frequency: 'Monthly',
    circulation: 1220540, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 4000, reach: '1.2M impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1800, reach: '800K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 2200, reach: '1M impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'smithsonian',
    name: 'Smithsonian Magazine',
    description: 'History, science, art, and culture',
    audience: 'History and culture enthusiasts',
    focus: 'science',
    geographic: 'nationwide',
    frequency: 'Monthly',
    circulation: 787456, // AAM July-Dec 2025
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2800, reach: '787K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Editorial Mention', publisherRate: 1200, reach: '500K impressions', description: 'Press mention' },
      { id: 'display', name: 'Display Banner', publisherRate: 1400, reach: '650K impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // REGIONAL PUBLICATIONS - WEST
  // ============================================
  {
    id: 'los-angeles-times',
    name: 'Los Angeles Times',
    description: 'Southern California news, entertainment, politics',
    audience: 'Los Angeles and SoCal residents',
    focus: 'general',
    geographic: 'regional',
    region: 'west',
    locality: 'los-angeles',
    frequency: 'Daily',
    circulation: 393019, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2800, reach: '393K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 1200, reach: '250K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1400, reach: '320K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'san-francisco-chronicle',
    name: 'San Francisco Chronicle',
    description: 'San Francisco and Bay Area news, tech, business',
    audience: 'Bay Area residents, tech professionals',
    focus: 'general',
    geographic: 'regional',
    region: 'west',
    locality: 'bay-area',
    frequency: 'Daily',
    circulation: 217725, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2200, reach: '218K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 900, reach: '140K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1100, reach: '180K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'mercury-news',
    name: 'San Jose Mercury News',
    description: 'Silicon Valley tech and business news',
    audience: 'Silicon Valley professionals, tech workers',
    focus: 'tech',
    geographic: 'local',
    region: 'west',
    locality: 'bay-area',
    frequency: 'Daily',
    circulation: 128239, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1800, reach: '128K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 750, reach: '80K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 900, reach: '105K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'san-diego-union-tribune',
    name: 'San Diego Union-Tribune',
    description: 'San Diego news, sports, entertainment',
    audience: 'San Diego residents',
    focus: 'general',
    geographic: 'regional',
    region: 'west',
    locality: 'san-diego',
    frequency: 'Daily',
    circulation: 137557, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1600, reach: '138K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 700, reach: '90K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 800, reach: '115K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'orange-county-register',
    name: 'Orange County Register',
    description: 'Orange County news and business',
    audience: 'Orange County residents',
    focus: 'general',
    geographic: 'local',
    region: 'west',
    locality: 'los-angeles',
    frequency: 'Daily',
    circulation: 134969, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1500, reach: '135K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 650, reach: '85K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 750, reach: '110K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'seattle-times',
    name: 'Seattle Times',
    description: 'Seattle and Pacific Northwest news',
    audience: 'Seattle and PNW residents',
    focus: 'general',
    geographic: 'regional',
    region: 'west',
    locality: 'seattle',
    frequency: 'Daily',
    circulation: 241315, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2000, reach: '241K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 850, reach: '155K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1000, reach: '200K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'denver-post',
    name: 'The Denver Post',
    description: 'Colorado news, sports, politics',
    audience: 'Colorado residents',
    focus: 'general',
    geographic: 'regional',
    region: 'west',
    locality: 'denver',
    frequency: 'Daily',
    circulation: 178628, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1800, reach: '179K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 800, reach: '115K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 950, reach: '150K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'arizona-republic',
    name: 'Arizona Republic',
    description: 'Phoenix and Arizona news',
    audience: 'Phoenix metro and Arizona residents',
    focus: 'general',
    geographic: 'regional',
    region: 'west',
    locality: 'phoenix',
    frequency: 'Daily',
    circulation: 56015, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1400, reach: '56K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 600, reach: '35K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 700, reach: '45K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'las-vegas-review-journal',
    name: 'Las Vegas Review-Journal',
    description: 'Las Vegas news, gaming, entertainment',
    audience: 'Las Vegas residents and visitors',
    focus: 'entertainment',
    geographic: 'regional',
    region: 'west',
    locality: 'las-vegas',
    frequency: 'Daily',
    circulation: 83964, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1500, reach: '84K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 650, reach: '55K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 750, reach: '70K impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // REGIONAL PUBLICATIONS - MIDWEST
  // ============================================
  {
    id: 'chicago-tribune',
    name: 'Chicago Tribune',
    description: 'Chicago and Illinois news, business, sports',
    audience: 'Chicago metro residents',
    focus: 'general',
    geographic: 'regional',
    region: 'midwest',
    locality: 'chicago',
    frequency: 'Daily',
    circulation: 275478, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2400, reach: '275K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 1000, reach: '175K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1200, reach: '230K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'chicago-sun-times',
    name: 'Chicago Sun-Times',
    description: 'Chicago tabloid news and sports',
    audience: 'Chicago residents',
    focus: 'general',
    geographic: 'local',
    region: 'midwest',
    locality: 'chicago',
    frequency: 'Daily',
    circulation: 38008, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1200, reach: '38K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 500, reach: '25K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 600, reach: '32K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'detroit-free-press',
    name: 'Detroit Free Press',
    description: 'Detroit and Michigan news',
    audience: 'Detroit metro residents',
    focus: 'general',
    geographic: 'regional',
    region: 'midwest',
    locality: 'detroit',
    frequency: 'Daily',
    circulation: 67572, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1400, reach: '68K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 600, reach: '45K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 700, reach: '55K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'star-tribune',
    name: 'Minnesota Star Tribune',
    description: 'Minneapolis-St. Paul and Minnesota news',
    audience: 'Twin Cities residents',
    focus: 'general',
    geographic: 'regional',
    region: 'midwest',
    locality: 'minneapolis',
    frequency: 'Daily',
    circulation: 198933, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1900, reach: '199K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 800, reach: '125K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 950, reach: '165K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'columbus-dispatch',
    name: 'Columbus Dispatch',
    description: 'Columbus and Central Ohio news',
    audience: 'Columbus area residents',
    focus: 'general',
    geographic: 'local',
    region: 'midwest',
    locality: 'columbus',
    frequency: 'Daily',
    circulation: 29982, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1000, reach: '30K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 400, reach: '20K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 500, reach: '25K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'indianapolis-star',
    name: 'Indianapolis Star',
    description: 'Indianapolis and Indiana news',
    audience: 'Indianapolis residents',
    focus: 'general',
    geographic: 'regional',
    region: 'midwest',
    locality: 'indianapolis',
    frequency: 'Daily',
    circulation: 30578, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1000, reach: '31K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 400, reach: '20K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 500, reach: '25K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'milwaukee-journal-sentinel',
    name: 'Milwaukee Journal Sentinel',
    description: 'Milwaukee and Wisconsin news',
    audience: 'Milwaukee area residents',
    focus: 'general',
    geographic: 'regional',
    region: 'midwest',
    locality: 'milwaukee',
    frequency: 'Daily',
    circulation: 48239, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1100, reach: '48K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 450, reach: '30K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 550, reach: '40K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'cincinnati-enquirer',
    name: 'Cincinnati Enquirer',
    description: 'Cincinnati and Southwest Ohio news',
    audience: 'Cincinnati area residents',
    focus: 'general',
    geographic: 'local',
    region: 'midwest',
    locality: 'cleveland',
    frequency: 'Daily',
    circulation: 31332, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 900, reach: '31K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 375, reach: '20K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 450, reach: '26K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'des-moines-register',
    name: 'Des Moines Register',
    description: 'Iowa news and politics',
    audience: 'Iowa residents',
    focus: 'general',
    geographic: 'regional',
    region: 'midwest',
    locality: 'kansas-city',
    frequency: 'Daily',
    circulation: 27394, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 800, reach: '27K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 350, reach: '17K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 400, reach: '23K impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // REGIONAL PUBLICATIONS - NORTHEAST
  // ============================================
  {
    id: 'ny-daily-news',
    name: 'New York Daily News',
    description: 'New York City tabloid news',
    audience: 'New York City residents',
    focus: 'general',
    geographic: 'regional',
    region: 'northeast',
    locality: 'new-york',
    frequency: 'Daily',
    circulation: 111418, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1800, reach: '111K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 750, reach: '70K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 900, reach: '95K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'ny-post',
    name: 'New York Post',
    description: 'New York City tabloid news and entertainment',
    audience: 'New York City residents',
    focus: 'entertainment',
    geographic: 'regional',
    region: 'northeast',
    locality: 'new-york',
    frequency: 'Daily',
    circulation: 486843, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2500, reach: '487K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 1000, reach: '310K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1200, reach: '400K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'newsday',
    name: 'Newsday',
    description: 'Long Island and Queens news',
    audience: 'Long Island residents',
    focus: 'general',
    geographic: 'local',
    region: 'northeast',
    locality: 'new-york',
    frequency: 'Daily',
    circulation: 167963, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1600, reach: '168K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 700, reach: '105K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 800, reach: '140K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'boston-globe',
    name: 'Boston Globe',
    description: 'Boston and New England news',
    audience: 'Boston metro residents',
    focus: 'general',
    geographic: 'regional',
    region: 'northeast',
    locality: 'boston',
    frequency: 'Daily',
    circulation: 80504, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1800, reach: '81K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 750, reach: '50K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 900, reach: '70K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'philadelphia-inquirer',
    name: 'Philadelphia Inquirer',
    description: 'Philadelphia and Pennsylvania news',
    audience: 'Philadelphia metro residents',
    focus: 'general',
    geographic: 'regional',
    region: 'northeast',
    locality: 'philadelphia',
    frequency: 'Daily',
    circulation: 248697, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 2000, reach: '249K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 850, reach: '155K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 1000, reach: '205K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'pittsburgh-tribune-review',
    name: 'Pittsburgh Tribune-Review',
    description: 'Pittsburgh and Western Pennsylvania news',
    audience: 'Pittsburgh area residents',
    focus: 'general',
    geographic: 'local',
    region: 'northeast',
    locality: 'pittsburgh',
    frequency: 'Daily',
    circulation: 30907, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 900, reach: '31K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 375, reach: '20K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 450, reach: '26K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'hartford-courant',
    name: 'Hartford Courant',
    description: 'Hartford and Connecticut news',
    audience: 'Connecticut residents',
    focus: 'general',
    geographic: 'regional',
    region: 'northeast',
    locality: 'hartford',
    frequency: 'Daily',
    circulation: 73700, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1200, reach: '74K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 500, reach: '47K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 600, reach: '62K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'times-union-albany',
    name: 'Times Union (Albany)',
    description: 'Albany and Capital Region news',
    audience: 'Capital Region residents',
    focus: 'general',
    geographic: 'local',
    region: 'northeast',
    locality: 'new-york',
    frequency: 'Daily',
    circulation: 67477, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1000, reach: '67K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 400, reach: '42K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 500, reach: '56K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'baltimore-sun',
    name: 'The Baltimore Sun',
    description: 'Baltimore and Maryland news',
    audience: 'Baltimore area residents',
    focus: 'general',
    geographic: 'regional',
    region: 'northeast',
    locality: 'baltimore',
    frequency: 'Daily',
    circulation: 84900, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1400, reach: '85K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 600, reach: '55K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 700, reach: '70K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'providence-journal',
    name: 'Providence Journal',
    description: 'Rhode Island news',
    audience: 'Rhode Island residents',
    focus: 'general',
    geographic: 'regional',
    region: 'northeast',
    locality: 'providence',
    frequency: 'Daily',
    circulation: 23556, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 800, reach: '24K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 350, reach: '15K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 400, reach: '20K impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // REGIONAL PUBLICATIONS - SOUTH
  // ============================================
  {
    id: 'dallas-morning-news',
    name: 'Dallas Morning News',
    description: 'Dallas and North Texas news',
    audience: 'Dallas-Fort Worth residents',
    focus: 'general',
    geographic: 'regional',
    region: 'south',
    locality: 'dallas',
    frequency: 'Daily',
    circulation: 139951, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1800, reach: '140K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 750, reach: '90K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 900, reach: '115K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'houston-chronicle',
    name: 'Houston Chronicle',
    description: 'Houston and Southeast Texas news',
    audience: 'Houston metro residents',
    focus: 'general',
    geographic: 'regional',
    region: 'south',
    locality: 'houston',
    frequency: 'Daily',
    circulation: 139466, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1800, reach: '139K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 750, reach: '90K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 900, reach: '115K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'austin-american-statesman',
    name: 'Austin American-Statesman',
    description: 'Austin and Central Texas news',
    audience: 'Austin area residents',
    focus: 'general',
    geographic: 'local',
    region: 'south',
    locality: 'austin',
    frequency: 'Daily',
    circulation: 37511, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1100, reach: '38K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 450, reach: '24K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 550, reach: '31K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'san-antonio-express-news',
    name: 'San Antonio Express-News',
    description: 'San Antonio and South Texas news',
    audience: 'San Antonio area residents',
    focus: 'general',
    geographic: 'local',
    region: 'south',
    locality: 'san-antonio',
    frequency: 'Daily',
    circulation: 64300, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1200, reach: '64K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 500, reach: '40K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 600, reach: '54K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'sun-sentinel',
    name: 'South Florida Sun-Sentinel',
    description: 'Fort Lauderdale and Broward County news',
    audience: 'Broward County residents',
    focus: 'general',
    geographic: 'local',
    region: 'south',
    locality: 'miami',
    frequency: 'Daily',
    circulation: 82470, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1200, reach: '82K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 500, reach: '55K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 600, reach: '70K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'orlando-sentinel',
    name: 'Orlando Sentinel',
    description: 'Orlando and Central Florida news',
    audience: 'Central Florida residents',
    focus: 'general',
    geographic: 'regional',
    region: 'south',
    locality: 'orlando',
    frequency: 'Daily',
    circulation: 69740, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1200, reach: '70K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 500, reach: '45K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 600, reach: '58K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'tennessean',
    name: 'The Tennessean',
    description: 'Nashville and Tennessee news',
    audience: 'Nashville area residents',
    focus: 'general',
    geographic: 'regional',
    region: 'south',
    locality: 'nashville',
    frequency: 'Daily',
    circulation: 17407, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 900, reach: '17K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 375, reach: '11K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 450, reach: '14K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'times-picayune',
    name: 'Times-Picayune / New Orleans Advocate',
    description: 'New Orleans and Louisiana news',
    audience: 'New Orleans area residents',
    focus: 'general',
    geographic: 'regional',
    region: 'south',
    locality: 'new-orleans',
    frequency: 'Daily',
    circulation: 68333, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 1100, reach: '68K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 450, reach: '44K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 550, reach: '57K impressions', description: 'Display advertising' },
    ]
  },
  {
    id: 'florida-times-union',
    name: 'Florida Times-Union',
    description: 'Jacksonville and Northeast Florida news',
    audience: 'Jacksonville area residents',
    focus: 'general',
    geographic: 'local',
    region: 'south',
    locality: 'orlando',
    frequency: 'Daily',
    circulation: 12463, // AAM Apr-Sep 2025 (Sunday)
    publisherCpm: 0,
    tiers: [
      { id: 'sponsored', name: 'Sponsored Article', publisherRate: 700, reach: '12K impressions', description: 'Sponsored content' },
      { id: 'mention', name: 'Press Mention', publisherRate: 300, reach: '8K impressions', description: 'Editorial coverage' },
      { id: 'display', name: 'Display Banner', publisherRate: 350, reach: '10K impressions', description: 'Display advertising' },
    ]
  },

  // ============================================
  // FREE NEWSROOM
  // ============================================
  {
    id: 'prhub-newsroom',
    name: 'PR Hub Newsroom',
    description: 'Free press release publication with RSS syndication',
    audience: 'General public, news aggregators',
    focus: 'general',
    geographic: 'international',
    frequency: 'Continuous',
    circulation: 50000, // Estimated monthly visitors
    publisherCpm: 0,
    isFree: true,
    tiers: [
      { id: 'standard', name: 'Standard Publication', publisherRate: 0, reach: '50K+ potential', description: 'Free press release listing' },
    ]
  },
]

// Export helper functions
export function getPublicationById(id: string): Publication | undefined {
  return publications.find(p => p.id === id)
}

export function getPublicationsByFocus(focus: string): Publication[] {
  return publications.filter(p => p.focus === focus)
}

export function getPublicationsByGeographic(geo: string): Publication[] {
  return publications.filter(p => p.geographic === geo)
}

export function getPublicationsByRegion(region: string): Publication[] {
  return publications.filter(p => p.region === region)
}

export function getPublicationsByLocality(locality: string): Publication[] {
  return publications.filter(p => p.locality === locality)
}
