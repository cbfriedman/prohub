'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { 
  createCampaignSchema, 
  updateCampaignSchema,
  type Campaign,
  type CreateCampaignInput,
  type UpdateCampaignInput,
} from '@/lib/validations/schemas'

export async function getCampaigns(): Promise<Campaign[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    // Return empty array for unauthenticated users
    return []
  }
  
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching campaigns:', error)
    return []
  }
  
  return data as Campaign[]
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }
  
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    console.error('Error fetching campaign:', error)
    return null
  }
  
  return data as Campaign
}

export async function createCampaign(input: CreateCampaignInput): Promise<{ success: boolean; data?: { id: string }; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Please sign in to create campaigns' }
  }
  
  // Validate input
  const validatedData = createCampaignSchema.safeParse(input)
  if (!validatedData.success) {
    return { success: false, error: validatedData.error.errors[0].message }
  }
  
  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      user_id: user.id,
      name: validatedData.data.name,
      target_audience: validatedData.data.target_audience || null,
      key_messages: validatedData.data.key_messages || null,
      geo_coverage: validatedData.data.geo_coverage || null,
      geo_regions: validatedData.data.geo_regions || null,
      geo_states: validatedData.data.geo_states || null,
      geo_counties: validatedData.data.geo_counties || null,
      status: 'draft',
    })
    .select('id')
    .single()
  
  if (error) {
    console.error('Error creating campaign:', error)
    return { success: false, error: 'Failed to create campaign' }
  }
  
  revalidatePath('/campaigns')
  return { success: true, data: { id: data.id } }
}

export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  // Validate input
  const validatedData = updateCampaignSchema.safeParse(input)
  if (!validatedData.success) {
    return { success: false, error: validatedData.error.errors[0].message }
  }
  
  const { error } = await supabase
    .from('campaigns')
    .update({
      ...validatedData.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error updating campaign:', error)
    return { success: false, error: 'Failed to update campaign' }
  }
  
  revalidatePath(`/campaigns/${id}`)
  revalidatePath('/campaigns')
  return { success: true }
}

export async function deleteCampaign(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error deleting campaign:', error)
    return { success: false, error: 'Failed to delete campaign' }
  }
  
  revalidatePath('/campaigns')
  return { success: true }
}

// Add publication to campaign
export async function addPublicationToCampaign(
  campaignId: string, 
  publicationId: string, 
  tierId: string | null, 
  price: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  // Verify campaign ownership
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id')
    .eq('id', campaignId)
    .eq('user_id', user.id)
    .single()
  
  if (!campaign) {
    return { success: false, error: 'Campaign not found' }
  }
  
  const { error } = await supabase
    .from('campaign_publications')
    .upsert({
      campaign_id: campaignId,
      publication_id: publicationId,
      tier_id: tierId,
      price,
    }, {
      onConflict: 'campaign_id,publication_id,tier_id',
    })
  
  if (error) {
    console.error('Error adding publication to campaign:', error)
    return { success: false, error: 'Failed to add publication' }
  }
  
  // Update campaign total cost
  await updateCampaignTotalCost(campaignId)
  
  revalidatePath(`/campaigns/${campaignId}`)
  return { success: true }
}

export async function removePublicationFromCampaign(
  campaignId: string,
  publicationId: string,
  tierId: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  let query = supabase
    .from('campaign_publications')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('publication_id', publicationId)
  
  if (tierId) {
    query = query.eq('tier_id', tierId)
  } else {
    query = query.is('tier_id', null)
  }
  
  const { error } = await query
  
  if (error) {
    console.error('Error removing publication from campaign:', error)
    return { success: false, error: 'Failed to remove publication' }
  }
  
  // Update campaign total cost
  await updateCampaignTotalCost(campaignId)
  
  revalidatePath(`/campaigns/${campaignId}`)
  return { success: true }
}

export async function getCampaignPublications(campaignId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('campaign_publications')
    .select(`
      *,
      publications (*),
      publication_tiers (*)
    `)
    .eq('campaign_id', campaignId)
  
  if (error) {
    console.error('Error fetching campaign publications:', error)
    return []
  }
  
  return data
}

// Get the user's most recent campaign with geographic targeting
export async function getActiveCampaignGeo(): Promise<{
  id: string
  name: string
  geo_coverage: string | null
  geo_regions: string[] | null
  geo_states: string[] | null
  geo_counties: string[] | null
  target_audience: string | null
} | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }
  
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, name, geo_coverage, geo_regions, geo_states, geo_counties, target_audience')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

async function updateCampaignTotalCost(campaignId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('campaign_publications')
    .select('price')
    .eq('campaign_id', campaignId)
  
  const totalCost = data?.reduce((sum, item) => sum + Number(item.price), 0) || 0
  
  await supabase
    .from('campaigns')
    .update({ total_cost: totalCost, updated_at: new Date().toISOString() })
    .eq('id', campaignId)
}
