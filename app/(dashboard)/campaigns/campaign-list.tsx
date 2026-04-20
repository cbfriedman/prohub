'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { MoreHorizontal, Trash2, Eye, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteCampaign } from '@/app/actions/campaigns'
import { useToast } from '@/hooks/use-toast'
import type { Campaign, CampaignStatus } from '@/lib/validations/schemas'

const statusColors: Record<CampaignStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-blue-600 text-white',
  submitted: 'bg-amber-500 text-white',
  published: 'bg-green-600 text-white',
}

interface CampaignListProps {
  campaigns: Campaign[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCampaign(id)
      if (result.success) {
        toast({
          title: 'Campaign deleted',
          description: 'The campaign has been removed.',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete campaign',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <Badge className={statusColors[campaign.status]}>
                  {campaign.status}
                </Badge>
                {campaign.published_to_newsroom && (
                  <Badge className="bg-green-100 text-green-700 border border-green-300">
                    In Newsroom
                  </Badge>
                )}
              </div>
              <CardDescription>
                Created {new Date(campaign.created_at).toLocaleDateString()} · 
                Updated {new Date(campaign.updated_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/campaigns/${campaign.id}`}>
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Target Audience
                </p>
                <p className="text-sm line-clamp-2">
                  {campaign.target_audience || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Cost
                </p>
                <p className="text-sm">
                  ${Number(campaign.total_cost || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Key Messages
                </p>
                <p className="text-sm line-clamp-2">
                  {campaign.key_messages 
                    ? (Array.isArray(campaign.key_messages) 
                        ? campaign.key_messages.join(', ') 
                        : String(campaign.key_messages))
                    : 'None added'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/campaigns/${campaign.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
              {campaign.press_release && (
                <Link href={`/campaigns/${campaign.id}?tab=press-release`}>
                  <Button variant="outline" size="sm">
                    View Press Release
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
