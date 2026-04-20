import Link from 'next/link'
import { Plus, Megaphone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCampaigns } from '@/app/actions/campaigns'
import { CampaignList } from './campaign-list'

export const metadata = {
  title: 'Campaigns | PR Hub',
  description: 'Create and manage your press release campaigns',
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your press release campaigns
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first campaign to start generating press releases
            </p>
            <Link href="/campaigns/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <CampaignList campaigns={campaigns} />
      )}
    </div>
  )
}
