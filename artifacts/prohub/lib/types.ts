export type Focus = 'tech' | 'business' | 'entertainment' | 'general' | 'science' | 'startup'
export type Geographic = 'nationwide' | 'regional' | 'local' | 'international'
export type CampaignStatus = 'draft' | 'active' | 'submitted' | 'published'

export interface PlacementTier {
  id: string
  name: string
  publisherRate: number // actual publisher rate
  reach: string
  description: string
}

export interface Publication {
  id: string
  name: string
  description: string
  audience: string
  focus: Focus
  geographic: Geographic
  region?: string // west, midwest, northeast, south
  locality?: string // bay-area, los-angeles, etc.
  frequency: string
  circulation: number
  publisherCpm: number // publisher's actual CPM
  tiers: PlacementTier[]
  isFree?: boolean
}

export interface CartItem {
  publicationId: string
  publicationName: string
  tierId: string
  tierName: string
  rate: number // marked up rate for display
  publisherRate: number // actual publisher rate
}

export interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  targetAudience: string
  keyMessages: string[]
  pressRelease: string
  videoScript: string
  selectedPublications: string[]
  youtubeUrl?: string
  publishedToNewsroom: boolean
  createdAt: string
  updatedAt: string
}

export interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
}

export interface PressReleaseCard {
  id: string
  campaignId: string
  companyName: string
  excerpt: string
  fullContent: string
  publishedAt: string
  youtubeUrl?: string
}
