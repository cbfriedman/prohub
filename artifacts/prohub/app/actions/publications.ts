'use server'

import { createClient } from '@/lib/supabase/server'
import { redis, CACHE_KEYS, CACHE_TTL } from '@/lib/redis'
import type { Publication, PublicationTier, PublicationFilters } from '@/lib/validations/schemas'

export interface PublicationWithTiers extends Publication {
  publication_tiers: PublicationTier[]
}

export async function getPublications(filters?: PublicationFilters): Promise<PublicationWithTiers[]> {
  const supabase = await createClient()
  
  // Try cache first (only if no filters)
  if (!filters || Object.keys(filters).every(k => !filters[k as keyof PublicationFilters])) {
    try {
      const cached = await redis.get<PublicationWithTiers[]>(CACHE_KEYS.publications)
      if (cached) {
        return cached
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }
  }
  
  let query = supabase
    .from('publications')
    .select(`
      *,
      publication_tiers (*)
    `)
    .order('name')
  
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  
  if (filters?.focus) {
    query = query.eq('focus', filters.focus)
  }
  
  if (filters?.geographic) {
    query = query.eq('geographic', filters.geographic)
  }
  
  if (filters?.region) {
    query = query.eq('region', filters.region)
  }
  
  if (filters?.locality) {
    query = query.eq('locality', filters.locality)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching publications:', error)
    throw new Error('Failed to fetch publications')
  }
  
  const publications = data as PublicationWithTiers[]
  
  // Cache if no filters
  if (!filters || Object.keys(filters).every(k => !filters[k as keyof PublicationFilters])) {
    try {
      await redis.set(CACHE_KEYS.publications, publications, { ex: CACHE_TTL.publications })
    } catch (error) {
      console.error('Redis cache set error:', error)
    }
  }
  
  return publications
}

export async function getPublicationById(id: string): Promise<PublicationWithTiers | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('publications')
    .select(`
      *,
      publication_tiers (*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching publication:', error)
    return null
  }
  
  return data as PublicationWithTiers
}

export async function getPublicationTiers(publicationId: string): Promise<PublicationTier[]> {
  const supabase = await createClient()
  
  // Try cache first
  try {
    const cached = await redis.get<PublicationTier[]>(CACHE_KEYS.publicationTiers(publicationId))
    if (cached) {
      return cached
    }
  } catch (error) {
    console.error('Redis cache error:', error)
  }
  
  const { data, error } = await supabase
    .from('publication_tiers')
    .select('*')
    .eq('publication_id', publicationId)
    .order('publisher_rate', { ascending: false })
  
  if (error) {
    console.error('Error fetching publication tiers:', error)
    throw new Error('Failed to fetch publication tiers')
  }
  
  // Cache result
  try {
    await redis.set(CACHE_KEYS.publicationTiers(publicationId), data, { ex: CACHE_TTL.tiers })
  } catch (error) {
    console.error('Redis cache set error:', error)
  }
  
  return data as PublicationTier[]
}

// Get unique regions and localities for filters
export async function getRegionsAndLocalities(): Promise<{
  regions: string[]
  localities: Record<string, string[]>
}> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('publications')
    .select('region, locality')
    .not('region', 'is', null)
  
  if (error) {
    console.error('Error fetching regions:', error)
    return { regions: [], localities: {} }
  }
  
  const regions = [...new Set(data.map(d => d.region).filter(Boolean))] as string[]
  const localities: Record<string, string[]> = {}
  
  regions.forEach(region => {
    localities[region] = [...new Set(
      data.filter(d => d.region === region).map(d => d.locality).filter(Boolean)
    )] as string[]
  })
  
  return { regions, localities }
}
