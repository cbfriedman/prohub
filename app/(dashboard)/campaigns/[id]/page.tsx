import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CampaignDetail } from './campaign-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    notFound()
  }
  
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  
  if (error || !campaign) {
    notFound()
  }
  
  // Fetch publications for distribution selection
  const { data: publications } = await supabase
    .from('publications')
    .select('*, publication_tiers(*)')
    .order('name')
  
  // Fetch selected publications for this campaign
  const { data: selectedPubs } = await supabase
    .from('campaign_publications')
    .select('publication_id, tier_id')
    .eq('campaign_id', id)
  
  return (
    <CampaignDetail 
      campaign={campaign} 
      publications={publications || []}
      selectedPublicationIds={selectedPubs?.map(p => p.publication_id) || []}
    />
  )
}
