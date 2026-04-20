'use server'

import { createClient } from '@/lib/supabase/server'

export interface PerformanceMetrics {
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  totalSpend: number
  averageCpm: number
  averageCtr: number
  averageConversionRate: number
  placements: number
}

export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpend: 0,
      averageCpm: 0,
      averageCtr: 0,
      averageConversionRate: 0,
      placements: 0,
    }
  }

  const { data: performance } = await supabase
    .from('campaign_performance')
    .select(`
      impressions,
      clicks,
      conversions,
      cost,
      campaign_id
    `)
    .in('campaign_id', 
      supabase
        .from('campaigns')
        .select('id')
        .eq('user_id', user.id)
    )

  if (!performance || performance.length === 0) {
    return {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpend: 0,
      averageCpm: 0,
      averageCtr: 0,
      averageConversionRate: 0,
      placements: 0,
    }
  }

  const totalImpressions = performance.reduce((sum, p) => sum + (p.impressions || 0), 0)
  const totalClicks = performance.reduce((sum, p) => sum + (p.clicks || 0), 0)
  const totalConversions = performance.reduce((sum, p) => sum + (p.conversions || 0), 0)
  const totalSpend = performance.reduce((sum, p) => sum + Number(p.cost || 0), 0)

  return {
    totalImpressions,
    totalClicks,
    totalConversions,
    totalSpend,
    averageCpm: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
    averageCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    averageConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    placements: performance.length,
  }
}

export interface CampaignPerformance {
  id: string
  campaign_id: string
  publication_id: string
  publication_name: string
  placement_type: 'sponsored' | 'editorial'
  cost: number
  circulation: number
  impressions: number
  clicks: number
  conversions: number
  cpm: number
  ctr: number
  conversion_rate: number
  published_at: string | null
  created_at: string
}

export interface PlacementTypeComparison {
  type: 'sponsored' | 'editorial'
  placements: number
  totalSpend: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  avgCpm: number
  avgCtr: number
  avgConversionRate: number
  costPerConversion: number
}

export async function getPerformanceByPlacementType(): Promise<{
  sponsored: PlacementTypeComparison | null
  editorial: PlacementTypeComparison | null
}> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { sponsored: null, editorial: null }
  }

  // Get user's campaigns first
  const { data: userCampaigns } = await supabase
    .from('campaigns')
    .select('id')
    .eq('user_id', user.id)

  if (!userCampaigns || userCampaigns.length === 0) {
    return { sponsored: null, editorial: null }
  }

  const campaignIds = userCampaigns.map(c => c.id)

  const { data: performance } = await supabase
    .from('campaign_performance')
    .select('*')
    .in('campaign_id', campaignIds)

  if (!performance || performance.length === 0) {
    return { sponsored: null, editorial: null }
  }

  const calculateMetrics = (items: typeof performance): PlacementTypeComparison | null => {
    if (items.length === 0) return null
    
    const totalSpend = items.reduce((sum, p) => sum + Number(p.cost || 0), 0)
    const totalImpressions = items.reduce((sum, p) => sum + (p.impressions || 0), 0)
    const totalClicks = items.reduce((sum, p) => sum + (p.clicks || 0), 0)
    const totalConversions = items.reduce((sum, p) => sum + (p.conversions || 0), 0)
    
    return {
      type: items[0].placement_type as 'sponsored' | 'editorial',
      placements: items.length,
      totalSpend,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgCpm: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
      avgCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      costPerConversion: totalConversions > 0 ? totalSpend / totalConversions : 0,
    }
  }

  const sponsored = performance.filter(p => p.placement_type === 'sponsored')
  const editorial = performance.filter(p => p.placement_type === 'editorial')

  return {
    sponsored: calculateMetrics(sponsored),
    editorial: calculateMetrics(editorial),
  }
}

export async function getCampaignPerformance(campaignId: string): Promise<CampaignPerformance[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('campaign_performance')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching campaign performance:', error)
    return []
  }

  return data || []
}
