'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CartItem, Campaign, PressReleaseCard } from '@/lib/types'

interface AppContextType {
  // Admin mode
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  
  // Cart
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (publicationId: string, tierId: string) => void
  clearCart: () => void
  isInCart: (publicationId: string, tierId: string) => boolean
  cartTotal: number
  
  // Campaigns
  campaigns: Campaign[]
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
  getCampaignById: (id: string) => Campaign | undefined
  
  // Published Press Releases
  publishedReleases: PressReleaseCard[]
  publishRelease: (release: PressReleaseCard) => void
  unpublishRelease: (id: string) => void
  
  // Cart drawer
  isCartOpen: boolean
  setIsCartOpen: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Sample campaigns data
const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'TechStart AI Launch',
    status: 'published',
    targetAudience: 'Tech executives, AI enthusiasts, and early adopters',
    keyMessages: ['Revolutionary AI technology', 'Enterprise-ready solution', 'Cost-effective automation'],
    pressRelease: `FOR IMMEDIATE RELEASE

TechStart Unveils Revolutionary AI Platform for Enterprise Automation

SAN FRANCISCO, CA - TechStart, a leading innovator in artificial intelligence solutions, today announced the launch of its groundbreaking AI platform designed to transform enterprise automation.

The new platform leverages advanced machine learning algorithms to automate complex business processes, reducing operational costs by up to 40% while improving accuracy and efficiency.

"We're excited to bring this transformative technology to market," said Jane Smith, CEO of TechStart. "Our platform represents a significant leap forward in enterprise AI capabilities, making sophisticated automation accessible to businesses of all sizes."

Key features of the platform include:
- Natural language processing for document analysis
- Predictive analytics for business intelligence
- Seamless integration with existing enterprise systems
- Real-time monitoring and optimization

The platform is now available for enterprise customers, with pricing starting at $5,000 per month.

For more information, visit www.techstart.ai

Media Contact:
John Doe
press@techstart.ai
(555) 123-4567`,
    videoScript: `[INTRO - 0:00-0:15]
NARRATOR: In a world where efficiency is everything...

[PROBLEM - 0:15-0:45]
NARRATOR: Businesses struggle with manual processes, wasting countless hours on repetitive tasks.

[SOLUTION - 0:45-1:30]
NARRATOR: Introducing TechStart AI - the revolutionary platform that transforms how enterprises operate.

[FEATURES - 1:30-2:15]
NARRATOR: With advanced natural language processing, predictive analytics, and seamless integration...

[CALL TO ACTION - 2:15-2:30]
NARRATOR: Join the automation revolution. Visit techstart.ai today.`,
    selectedPublications: ['techcrunch', 'wired', 'prhub-newsroom'],
    youtubeUrl: 'https://youtube.com/watch?v=example1',
    publishedToNewsroom: true,
    createdAt: '2026-04-15T10:00:00Z',
    updatedAt: '2026-04-18T14:30:00Z',
  },
  {
    id: '2',
    name: 'GreenEnergy Solar Partnership',
    status: 'active',
    targetAudience: 'Sustainability-focused businesses, investors, environmental advocates',
    keyMessages: ['Sustainable energy solutions', 'Cost savings', 'Environmental impact'],
    pressRelease: `FOR IMMEDIATE RELEASE

GreenEnergy Announces Strategic Partnership with Major Solar Provider

OAKLAND, CA - GreenEnergy Corp today announced a strategic partnership with SolarMax Inc. to expand renewable energy access across the Bay Area.

The partnership will bring affordable solar solutions to over 10,000 homes and businesses in the next 18 months.

"This partnership represents a major step forward in our mission to make sustainable energy accessible to everyone," said Maria Garcia, Founder of GreenEnergy Corp.

For more information, visit www.greenenergy.com`,
    videoScript: `[INTRO]
NARRATOR: The future of energy is here...

[PARTNERSHIP ANNOUNCEMENT]
NARRATOR: GreenEnergy and SolarMax join forces to power a sustainable tomorrow.

[IMPACT]
NARRATOR: 10,000 homes. 18 months. One mission: clean energy for all.`,
    selectedPublications: ['sf-chronicle', 'mercury-news'],
    publishedToNewsroom: false,
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-04-17T11:15:00Z',
  },
  {
    id: '3',
    name: 'HealthTech Funding Round',
    status: 'draft',
    targetAudience: 'Healthcare investors, medical professionals, tech industry',
    keyMessages: ['Series B funding', 'Healthcare innovation', 'Patient outcomes'],
    pressRelease: '',
    videoScript: '',
    selectedPublications: [],
    publishedToNewsroom: false,
    createdAt: '2026-04-18T16:00:00Z',
    updatedAt: '2026-04-18T16:00:00Z',
  },
]

const initialPublishedReleases: PressReleaseCard[] = [
  {
    id: 'pr-1',
    campaignId: '1',
    companyName: 'TechStart',
    excerpt: 'TechStart, a leading innovator in artificial intelligence solutions, today announced the launch of its groundbreaking AI platform designed to transform enterprise automation.',
    fullContent: initialCampaigns[0].pressRelease,
    publishedAt: '2026-04-18T14:30:00Z',
    youtubeUrl: 'https://youtube.com/watch?v=example1',
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [publishedReleases, setPublishedReleases] = useState<PressReleaseCard[]>(initialPublishedReleases)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prev => {
      const exists = prev.some(
        i => i.publicationId === item.publicationId && i.tierId === item.tierId
      )
      if (exists) return prev
      return [...prev, item]
    })
  }, [])

  const removeFromCart = useCallback((publicationId: string, tierId: string) => {
    setCartItems(prev => 
      prev.filter(i => !(i.publicationId === publicationId && i.tierId === tierId))
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const isInCart = useCallback((publicationId: string, tierId: string) => {
    return cartItems.some(
      i => i.publicationId === publicationId && i.tierId === tierId
    )
  }, [cartItems])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.rate, 0)

  const addCampaign = useCallback((campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign])
  }, [])

  const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => 
      prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
    )
  }, [])

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }, [])

  const getCampaignById = useCallback((id: string) => {
    return campaigns.find(c => c.id === id)
  }, [campaigns])

  const publishRelease = useCallback((release: PressReleaseCard) => {
    setPublishedReleases(prev => {
      const exists = prev.some(r => r.campaignId === release.campaignId)
      if (exists) {
        return prev.map(r => r.campaignId === release.campaignId ? release : r)
      }
      return [...prev, release]
    })
  }, [])

  const unpublishRelease = useCallback((id: string) => {
    setPublishedReleases(prev => prev.filter(r => r.id !== id))
  }, [])

  return (
    <AppContext.Provider value={{
      isAdmin,
      setIsAdmin,
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      cartTotal,
      campaigns,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      getCampaignById,
      publishedReleases,
      publishRelease,
      unpublishRelease,
      isCartOpen,
      setIsCartOpen,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
