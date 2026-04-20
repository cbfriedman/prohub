import { Suspense } from 'react'
import { getPublications } from '@/app/actions/publications'
import { getActiveCampaignGeo } from '@/app/actions/campaigns'
import { PublicationsPageClient } from './publications-client'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Publications | PR Hub',
  description: 'Browse 60+ publications and their advertising rates',
}

export default async function PublicationsPage() {
  const [publications, activeCampaign] = await Promise.all([
    getPublications(),
    getActiveCampaignGeo()
  ])

  return (
    <div className="p-6 lg:p-8">
      <Suspense fallback={<PublicationsLoading />}>
        <PublicationsPageClient 
          publications={publications} 
          activeCampaign={activeCampaign}
        />
      </Suspense>
    </div>
  )
}

function PublicationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72 mt-2" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}
