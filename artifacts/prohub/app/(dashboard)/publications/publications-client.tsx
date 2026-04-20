'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { PublicationsTable } from '@/components/publications-table'
import { AdminToggle } from '@/components/admin-toggle'
import { useAdminStore } from '@/lib/stores/admin-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { MapPin, Target, Sparkles, ArrowRight, Info, ChevronDown, ChevronUp, Megaphone, FileText, Check, X, HelpCircle } from 'lucide-react'
import type { PublicationWithTiers } from '@/app/actions/publications'
import { US_REGIONS, US_STATES } from '@/lib/data/geographic'
import { regions as publicationRegions } from '@/lib/data/publications'

interface ActiveCampaign {
  id: string
  name: string
  geo_coverage: string | null
  geo_regions: string[] | null
  geo_states: string[] | null
  geo_counties: string[] | null
  target_audience: string | null
}

interface PublicationsPageClientProps {
  publications: PublicationWithTiers[]
  activeCampaign?: ActiveCampaign | null
}

export function PublicationsPageClient({ publications, activeCampaign }: PublicationsPageClientProps) {
  const { isAdmin: isAdminRaw } = useAdminStore()
  const [mounted, setMounted] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isAdmin = mounted && isAdminRaw

  // Filter out free publications for non-admin users
  const visiblePublications = useMemo(() => {
    if (isAdmin) return publications
    return publications.filter(pub => !pub.is_free)
  }, [publications, isAdmin])

  // Calculate recommended publications based on campaign geography
  const { recommendedPubs, otherPubs, hasRecommendations } = useMemo(() => {
    if (!activeCampaign || !activeCampaign.geo_coverage) {
      return { recommendedPubs: [], otherPubs: visiblePublications, hasRecommendations: false }
    }

    const recommended: PublicationWithTiers[] = []
    const other: PublicationWithTiers[] = []

    visiblePublications.forEach(pub => {
      let isRecommended = false

      switch (activeCampaign.geo_coverage) {
        case 'international':
          // Recommend international publications
          isRecommended = pub.geographic === 'international'
          break

        case 'national':
          // Recommend nationwide and international publications
          isRecommended = pub.geographic === 'nationwide' || pub.geographic === 'international'
          break

        case 'regional':
          // Recommend publications in selected regions or nationwide
          if (pub.geographic === 'nationwide' || pub.geographic === 'international') {
            isRecommended = true
          } else if (pub.geographic === 'regional' && pub.region && activeCampaign.geo_regions) {
            isRecommended = activeCampaign.geo_regions.includes(pub.region.toLowerCase())
          }
          break

        case 'state':
          // Recommend publications in selected states, matching regions, or nationwide
          if (pub.geographic === 'nationwide' || pub.geographic === 'international') {
            isRecommended = true
          } else if (activeCampaign.geo_states) {
            // Check if publication is in a selected state
            if (pub.geographic === 'regional' && pub.region) {
              const regionStates = US_REGIONS.find(r => r.value === pub.region.toLowerCase())?.states || []
              isRecommended = regionStates.some(s => activeCampaign.geo_states?.includes(s))
            }
            // Check locality/state match
            if (pub.locality) {
              const stateMatch = activeCampaign.geo_states.some(state => 
                pub.locality?.toLowerCase().includes(US_STATES.find(s => s.value === state)?.label.toLowerCase() || '')
              )
              if (stateMatch) isRecommended = true
            }
          }
          break

        case 'local':
          // For local campaigns, recommend publications matching the selected counties/localities
          if (activeCampaign.geo_counties && activeCampaign.geo_counties.length > 0) {
            // Bay Area counties that should match 'bay-area' publications
            const bayAreaCounties = ['bay-area', 'san-francisco', 'alameda', 'santa-clara', 'san-mateo', 'contra-costa', 'marin', 'sonoma', 'napa', 'solano']
            const selectedBayAreaCounties = activeCampaign.geo_counties.filter(c => bayAreaCounties.includes(c))
            
            // Check if publication's locality matches any selected county
            if (pub.locality) {
              // Direct match
              if (activeCampaign.geo_counties.includes(pub.locality)) {
                isRecommended = true
              }
              // Bay Area special case: if user selected any Bay Area county, match bay-area publications
              if (pub.locality === 'bay-area' && selectedBayAreaCounties.length > 0) {
                isRecommended = true
              }
            }
          }
          break
      }

      if (isRecommended) {
        recommended.push(pub)
      } else {
        other.push(pub)
      }
    })

    return { 
      recommendedPubs: recommended, 
      otherPubs: other, 
      hasRecommendations: recommended.length > 0 
    }
  }, [visiblePublications, activeCampaign])

  // Format geographic targeting for display
  const getGeoDescription = () => {
    if (!activeCampaign) return null

    switch (activeCampaign.geo_coverage) {
      case 'international':
        return 'International coverage'
      case 'national':
        return 'National (US) coverage'
      case 'regional':
        const regionLabels = activeCampaign.geo_regions?.map(r => 
          US_REGIONS.find(reg => reg.value === r)?.label || r
        ).join(', ')
        return `Regional: ${regionLabels || 'Selected regions'}`
      case 'state':
        const stateLabels = activeCampaign.geo_states?.slice(0, 3).map(s => 
          US_STATES.find(st => st.value === s)?.label || s
        ).join(', ')
        const moreStates = (activeCampaign.geo_states?.length || 0) > 3 
          ? ` +${activeCampaign.geo_states!.length - 3} more` 
          : ''
        return `States: ${stateLabels}${moreStates}`
      case 'local':
        return `Local coverage (${activeCampaign.geo_counties?.length || 0} counties)`
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
          <p className="text-muted-foreground mt-1">
            Browse {visiblePublications.length} publications and view their advertising rates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/learn/placement-types">
            <Button variant="outline" size="sm" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Learn More
            </Button>
          </Link>
          <AdminToggle />
        </div>
      </div>

      {/* Placement Types Info Banner */}
      <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <Card className="border-slate-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-slate-600" />
                  <CardTitle className="text-base">Sponsored Articles vs. Editorial Mentions</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  {isInfoOpen ? (
                    <>Hide <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Show Details <ChevronDown className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
              <CardDescription>
                Choose the right placement type for your PR goals
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sponsored Article */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Megaphone className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-blue-900">Sponsored Article</h3>
                    <Badge variant="secondary" className="text-xs">Full Rate</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You control the content and messaging. Guaranteed placement with your approved copy.
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Full control over content and messaging</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Guaranteed placement and timing</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Includes backlinks (SEO benefit)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Higher click-through rates (1-4% CTR)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <span>Labeled as &quot;Sponsored&quot; or &quot;Paid&quot;</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Best for: Direct response campaigns, product launches, SEO
                  </p>
                </div>

                {/* Editorial Mention */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-purple-900">Editorial Mention</h3>
                    <Badge variant="secondary" className="text-xs">60% of Rate</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Publication writes about you organically. Higher credibility as third-party coverage.
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Higher perceived credibility</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Appears as regular editorial content</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Better brand perception lift</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Higher conversion quality (2-3x)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <span>Less control over final content</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Best for: Brand awareness, thought leadership, PR coverage
                  </p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Campaign Banner - Always show when there's an active campaign */}
      {activeCampaign && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">
                  Publications for: {activeCampaign.name}
                </CardTitle>
              </div>
              <Link href={`/campaigns/${activeCampaign.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  View Campaign
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            {activeCampaign.geo_coverage && (
              <CardDescription>
                Showing recommendations based on your campaign targeting
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              {activeCampaign.geo_coverage && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{getGeoDescription()}</Badge>
                </div>
              )}
              {activeCampaign.target_audience && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="max-w-xs truncate">
                    {activeCampaign.target_audience}
                  </Badge>
                </div>
              )}
              {hasRecommendations ? (
                <Badge className="bg-green-600">
                  {recommendedPubs.length} recommended publications
                </Badge>
              ) : activeCampaign.geo_coverage ? (
                <Badge variant="outline" className="text-muted-foreground">
                  No exact matches - showing all publications
                </Badge>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
          <span className="font-medium text-amber-600">Admin Mode:</span>{' '}
          <span className="text-muted-foreground">
            Viewing internal pricing with 20% markup breakdown
          </span>
        </div>
      )}

      {/* Show all publications with recommended ones at the top */}
      <PublicationsTable 
        publications={visiblePublications} 
        isAdmin={isAdmin} 
        recommendedIds={recommendedPubs.map(p => p.id)}
      />
    </div>
  )
}
