import Link from 'next/link'
import { 
  Megaphone, 
  Newspaper, 
  FileText, 
  Plus,
  ArrowRight,
  Eye,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  BarChart3,
  Clock,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPublications } from '@/app/actions/publications'
import { getCampaigns } from '@/app/actions/campaigns'
import { getPerformanceMetrics, getPerformanceByPlacementType } from '@/app/actions/performance'
import { DashboardClient } from '../dashboard-client'
import { formatCurrency } from '@/lib/constants'

export default async function DashboardPage() {
  const [publications, campaigns, performance, typeComparison] = await Promise.all([
    getPublications(),
    getCampaigns(),
    getPerformanceMetrics(),
    getPerformanceByPlacementType(),
  ])

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'published').length
  const draftCampaigns = campaigns.filter(c => c.status === 'draft').length

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your PR campaigns and track your media placements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Campaigns
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCampaigns} active, {draftCampaigns} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Publications
            </CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for distribution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Media Placements
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.placements}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active placements
            </p>
          </CardContent>
        </Card>

        <DashboardClient />
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Metrics
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Impressions
              </CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.totalImpressions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clicks
              </CardTitle>
              <MousePointerClick className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                CTR: {performance.averageCtr.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.totalConversions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rate: {performance.averageConversionRate.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spend
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(performance.totalSpend)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                CPM: ${performance.averageCpm.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                ROI Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {performance.totalSpend > 0 
                  ? `${((performance.totalConversions / performance.totalSpend) * 100).toFixed(1)}%`
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Conversions per dollar
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Placement Type Comparison */}
      {(typeComparison.sponsored || typeComparison.editorial) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Sponsored vs. Editorial Performance
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Sponsored Articles */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Megaphone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sponsored Articles</CardTitle>
                    <CardDescription>Full content control, guaranteed placement</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {typeComparison.sponsored ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Placements</p>
                        <p className="text-xl font-bold">{typeComparison.sponsored.placements}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spend</p>
                        <p className="text-xl font-bold">{formatCurrency(typeComparison.sponsored.totalSpend)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="font-semibold text-blue-600">{typeComparison.sponsored.avgCtr.toFixed(2)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Conv. Rate</p>
                        <p className="font-semibold text-blue-600">{typeComparison.sponsored.avgConversionRate.toFixed(2)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Cost/Conv</p>
                        <p className="font-semibold text-blue-600">{formatCurrency(typeComparison.sponsored.costPerConversion)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No sponsored articles yet</p>
                )}
              </CardContent>
            </Card>

            {/* Editorial Mentions */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Editorial Mentions</CardTitle>
                    <CardDescription>Higher credibility, organic coverage</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {typeComparison.editorial ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Placements</p>
                        <p className="text-xl font-bold">{typeComparison.editorial.placements}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spend</p>
                        <p className="text-xl font-bold">{formatCurrency(typeComparison.editorial.totalSpend)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="font-semibold text-purple-600">{typeComparison.editorial.avgCtr.toFixed(2)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Conv. Rate</p>
                        <p className="font-semibold text-purple-600">{typeComparison.editorial.avgConversionRate.toFixed(2)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Cost/Conv</p>
                        <p className="font-semibold text-purple-600">{formatCurrency(typeComparison.editorial.costPerConversion)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No editorial mentions yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Submission Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Your Submission Status
        </h2>
        <Card>
          <CardContent className="pt-6">
            {/* Mock submission status for demo - in production this would come from database */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">San Francisco Chronicle</p>
                    <p className="text-sm text-muted-foreground">Sponsored Article - Digs and Gigs Launch</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Pending Review
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Send className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Freshhawk Journal</p>
                    <p className="text-sm text-muted-foreground">Editorial Mention - Digs and Gigs Launch</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                  Submitted to Publication
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">SFGate</p>
                    <p className="text-sm text-muted-foreground">Editorial Mention - Digs and Gigs Launch</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border border-green-200">
                  Approved - Publishing Soon
                </Badge>
              </div>
            </div>
            
            {campaigns.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
                <p className="text-sm">Create a campaign and purchase placements to see status updates here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/campaigns/new" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Create New Campaign</p>
                  <p className="text-sm text-muted-foreground">Start a new PR campaign with AI-generated content</p>
                </div>
              </Button>
            </Link>
            <Link href="/publications" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
                  <Newspaper className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Browse Publications</p>
                  <p className="text-sm text-muted-foreground">Explore {publications.length} publications and their ad rates</p>
                </div>
              </Button>
            </Link>
            <Link href="/newsroom" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/10">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left flex items-center gap-2">
                  <p className="font-medium">Visit Newsroom</p>
                  <Badge className="bg-green-600 text-white text-xs">Free</Badge>
                </div>
                <p className="text-sm text-muted-foreground">View published press releases</p>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest PR campaigns</CardDescription>
            </div>
            <Link href="/campaigns">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No campaigns yet</p>
                <p className="text-sm">Create your first campaign to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.slice(0, 4).map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(campaign.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={campaign.status === 'published' ? 'default' : 'secondary'}
                      className={
                        campaign.status === 'published' 
                          ? 'bg-green-600 text-white' 
                          : campaign.status === 'active'
                          ? 'bg-blue-600 text-white'
                          : ''
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
