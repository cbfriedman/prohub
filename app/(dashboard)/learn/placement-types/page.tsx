import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ArrowLeft, 
  Megaphone, 
  FileText, 
  Check, 
  X, 
  TrendingUp, 
  DollarSign,
  Eye,
  MousePointerClick,
  Target,
  Shield,
  Clock,
  BarChart3,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

export default function PlacementTypesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/publications" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Publications
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Sponsored Articles vs. Editorial Mentions</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Understanding the differences to choose the right placement type for your PR goals
          </p>
        </div>

        {/* Quick Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Sponsored Article */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/80 to-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-900">Sponsored Article</CardTitle>
                  <Badge className="bg-blue-100 text-blue-700">Full Rate</Badge>
                </div>
              </div>
              <CardDescription className="text-base">
                You control the content. Guaranteed placement with your approved messaging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Full editorial control over content and messaging</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Guaranteed placement date and positioning</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Includes backlinks to your website (SEO benefit)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Higher click-through rates (1-4% average)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Predictable reach and impressions</span>
                </div>
                <Separator className="my-4" />
                <div className="flex items-start gap-3 text-muted-foreground">
                  <X className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <span>Must be labeled as &quot;Sponsored&quot;, &quot;Paid&quot;, or &quot;Advertisement&quot;</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <X className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <span>Readers may be more skeptical of sponsored content</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editorial Mention */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50/80 to-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-purple-900">Editorial Mention</CardTitle>
                  <Badge className="bg-purple-100 text-purple-700">60% of Rate</Badge>
                </div>
              </div>
              <CardDescription className="text-base">
                Publication writes about you. Higher credibility as third-party coverage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Higher perceived credibility and trust</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Appears as regular editorial content (no &quot;sponsored&quot; label)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Better brand perception and reputation lift</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Higher conversion quality (2-3x better)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>More organic social sharing</span>
                </div>
                <Separator className="my-4" />
                <div className="flex items-start gap-3 text-muted-foreground">
                  <X className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <span>Less control over final content and messaging</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <X className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <span>Editor decides placement and timing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison Table */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailed Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Aspect</TableHead>
                  <TableHead className="text-blue-600">Sponsored Article</TableHead>
                  <TableHead className="text-purple-600">Editorial Mention</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Content Control</TableCell>
                  <TableCell>Full control - you write/approve everything</TableCell>
                  <TableCell>Provide info, but editor writes the story</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Credibility</TableCell>
                  <TableCell>Lower (readers know it&apos;s paid)</TableCell>
                  <TableCell>Higher (perceived as third-party endorsement)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Labeling</TableCell>
                  <TableCell>Required: &quot;Sponsored&quot; or &quot;Paid&quot; disclosure</TableCell>
                  <TableCell>None - appears as regular editorial</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pricing</TableCell>
                  <TableCell>Full rate (100%)</TableCell>
                  <TableCell>60% of full rate</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Placement</TableCell>
                  <TableCell>Guaranteed, you negotiate position</TableCell>
                  <TableCell>Editor decides where/when it runs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Backlinks</TableCell>
                  <TableCell>Usually includes (SEO value)</TableCell>
                  <TableCell>May or may not include links</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Average CTR</TableCell>
                  <TableCell>1-4%</TableCell>
                  <TableCell>0.5-2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Conversion Quality</TableCell>
                  <TableCell>Standard</TableCell>
                  <TableCell>2-3x higher</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* When to Use Each */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Target className="h-5 w-5" />
                When to Choose Sponsored Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Product launches</strong> - when you need exact messaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <MousePointerClick className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Direct response campaigns</strong> - when CTR matters most</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>SEO campaigns</strong> - for guaranteed backlinks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Time-sensitive announcements</strong> - with specific dates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Regulated industries</strong> - when compliance requires exact wording</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Target className="h-5 w-5" />
                When to Choose Editorial Mentions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Brand awareness</strong> - building recognition and trust</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Thought leadership</strong> - establishing expertise</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>PR coverage</strong> - when third-party credibility matters</span>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Budget optimization</strong> - more placements for less</span>
                </li>
                <li className="flex items-start gap-3">
                  <MousePointerClick className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Lead quality focus</strong> - when conversion quality &gt; quantity</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Performance Tracking */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              How to Track Performance
            </CardTitle>
            <CardDescription>
              Measure the effectiveness of your placements with these methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">UTM Parameters</h4>
                <p className="text-sm text-muted-foreground">
                  Add tracking parameters to your links to measure traffic source:
                </p>
                <code className="block p-3 bg-slate-100 rounded-lg text-xs break-all">
                  ?utm_source=techcrunch&amp;utm_medium=sponsored&amp;utm_campaign=product-launch
                </code>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Publisher Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Request performance reports from publications including:
                </p>
                <ul className="text-sm space-y-1">
                  <li>- Page views and unique visitors</li>
                  <li>- Time on page / engagement metrics</li>
                  <li>- Click-through rates on links</li>
                  <li>- Social shares and engagement</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Conversion Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Set up goals in your analytics to track:
                </p>
                <ul className="text-sm space-y-1">
                  <li>- Landing page conversions</li>
                  <li>- Lead form submissions</li>
                  <li>- Email sign-ups</li>
                  <li>- Purchase completions</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">PR Hub Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Your PR Hub dashboard tracks performance by placement type:
                </p>
                <ul className="text-sm space-y-1">
                  <li>- Impressions and reach</li>
                  <li>- CPM (cost per thousand impressions)</li>
                  <li>- CTR comparison by type</li>
                  <li>- Conversion rate analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Can I do both types for the same story?</h4>
              <p className="text-muted-foreground">
                Yes! Many successful campaigns use a combination. You might lead with an exclusive editorial mention at a top-tier publication for credibility, then follow up with sponsored articles at other outlets for broader reach and SEO benefits.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">How long does each type take to publish?</h4>
              <p className="text-muted-foreground">
                Sponsored articles typically publish within 5-7 business days (or 1-2 days with rush). Editorial mentions depend on the publication&apos;s editorial calendar and may take 1-4 weeks.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">What if I&apos;m not happy with an editorial mention?</h4>
              <p className="text-muted-foreground">
                Editorial mentions give the publication creative freedom. While you can provide talking points and key messages, you won&apos;t have final approval. If message control is critical, choose a sponsored article instead.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Do editorial mentions really convert better?</h4>
              <p className="text-muted-foreground">
                Yes, studies consistently show that while sponsored articles get more clicks, editorial coverage converts 2-3x better because readers trust third-party endorsements more than paid content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Browse publications and select the placement types that fit your goals.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/publications">
                  Browse Publications
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
