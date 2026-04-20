'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Video, 
  Send, 
  Globe,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { updateCampaignSchema, type UpdateCampaignInput, type CampaignStatus } from '@/lib/validations/schemas'
import { updateCampaign } from '@/app/actions/campaigns'
import { generatePressRelease, generateVideoScript } from '@/app/actions/ai'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, MARKUP_PERCENTAGE } from '@/lib/constants'

interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  target_audience: string | null
  key_messages: string | null
  press_release_content: string | null
  video_script_content: string | null
  publish_to_newsroom: boolean
  youtube_url: string | null
  total_cost: number
  created_at: string | null
}

interface Publication {
  id: string
  name: string
  description: string | null
  is_free: boolean
  publication_tiers: {
    id: string
    name: string
    publisher_rate: number
  }[]
}

interface Props {
  campaign: Campaign
  publications: Publication[]
  selectedPublicationIds: string[]
}

const statusColors: Record<CampaignStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-blue-100 text-blue-800',
  submitted: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
}

export function CampaignDetail({ campaign, publications, selectedPublicationIds }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isGeneratingPR, setIsGeneratingPR] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pressReleaseContent, setPressReleaseContent] = useState(campaign.press_release_content || '')
  const [videoScriptContent, setVideoScriptContent] = useState(campaign.video_script_content || '')
  const [selectedPubs, setSelectedPubs] = useState<string[]>(selectedPublicationIds)
  const [publishToNewsroom, setPublishToNewsroom] = useState(campaign.publish_to_newsroom)
  const [youtubeUrl, setYoutubeUrl] = useState(campaign.youtube_url || '')
  const [pressReleaseSaved, setPressReleaseSaved] = useState(!!campaign.press_release_content)
  const [pressReleaseNumber, setPressReleaseNumber] = useState(campaign.press_release_content ? 1 : 0)
  const [changesSaved, setChangesSaved] = useState(false)

  const form = useForm<UpdateCampaignInput>({
    resolver: zodResolver(updateCampaignSchema),
    defaultValues: {
      name: campaign.name,
      target_audience: campaign.target_audience || '',
      key_messages: campaign.key_messages || '',
    },
  })

  const handleSave = (data: UpdateCampaignInput) => {
    startTransition(async () => {
      const result = await updateCampaign(campaign.id, {
        ...data,
        press_release_content: pressReleaseContent,
        video_script_content: videoScriptContent,
        publish_to_newsroom: publishToNewsroom,
        youtube_url: youtubeUrl,
      })
      
      if (result.success) {
        setChangesSaved(true)
        toast({ title: 'Campaign saved', description: 'Your changes have been saved.' })
        router.refresh()
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const handleGeneratePR = async () => {
    setIsGeneratingPR(true)
    const result = await generatePressRelease({
      campaign_name: campaign.name,
      target_audience: campaign.target_audience || undefined,
      key_messages: campaign.key_messages || undefined,
    })
    
    if (result.success && result.content) {
      setPressReleaseContent(result.content)
      // Auto-save
      await updateCampaign(campaign.id, { 
        press_release_content: result.content,
        status: 'active' 
      })
      toast({ title: 'Press release generated', description: 'Your press release has been created.' })
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
    setIsGeneratingPR(false)
  }

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true)
    const result = await generateVideoScript({
      campaign_name: campaign.name,
      press_release_content: pressReleaseContent || undefined,
      target_audience: campaign.target_audience || undefined,
    })
    
    if (result.success && result.content) {
      setVideoScriptContent(result.content)
      await updateCampaign(campaign.id, { video_script_content: result.content })
      toast({ title: 'Video script generated', description: 'Your video script has been created.' })
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
    setIsGeneratingVideo(false)
  }

  const handleCopyPR = () => {
    navigator.clipboard.writeText(pressReleaseContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTogglePublication = (pubId: string) => {
    setSelectedPubs(prev => 
      prev.includes(pubId) 
        ? prev.filter(id => id !== pubId) 
        : [...prev, pubId]
    )
  }

  const handleToggleNewsroom = async (publish: boolean) => {
    setPublishToNewsroom(publish)
    const result = await updateCampaign(campaign.id, {
      publish_to_newsroom: publish,
      youtube_url: youtubeUrl,
      status: publish ? 'published' : campaign.status,
    })
    if (result.success) {
      toast({ 
        title: publish ? 'Published to Newsroom' : 'Unpublished', 
        description: publish ? 'Your press release is now visible in the newsroom.' : 'Your press release has been removed from the newsroom.' 
      })
    }
  }

  const distributionCost = selectedPubs
    .map(id => publications.find(p => p.id === id))
    .filter((p): p is Publication => p !== undefined && !p.is_free)
    .reduce((sum, pub) => {
      const rate = pub.publication_tiers[0]?.publisher_rate || 0
      return sum + Math.round(rate * (1 + MARKUP_PERCENTAGE))
    }, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance">{campaign.name}</h1>
          <Badge className={statusColors[campaign.status]}>
            {campaign.status}
          </Badge>
          {publishToNewsroom && (
            <Badge className="bg-green-100 text-green-800">
              In Newsroom
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          Created {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'Unknown'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="press-release" className="gap-2">
            <FileText className="h-4 w-4" />
            Press Release
          </TabsTrigger>
          <TabsTrigger value="video-script" className="gap-2">
            <Video className="h-4 w-4" />
            Video Script
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-2">
            <Send className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="publish" className="gap-2">
            <Globe className="h-4 w-4" />
            Publish
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Overview</CardTitle>
              <CardDescription>Edit your campaign details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="target_audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="key_messages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Messages</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="One message per line..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isPending} className={`gap-2 ${changesSaved ? 'bg-green-600 hover:bg-green-600' : ''}`}>
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : changesSaved ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {changesSaved ? 'Changes Saved' : 'Save Changes'}
                    </Button>
                    {changesSaved && pressReleaseContent && (
                      <Button 
                        type="button"
                        asChild
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Link href="/publications">
                          <Send className="h-4 w-4" />
                          Publish your Press Release
                        </Link>
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Press Release Tab */}
        <TabsContent value="press-release">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                AI-Generated Press Release
              </CardTitle>
              <CardDescription>
                Generate and edit your press release content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pressReleaseContent ? (
                <>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleGeneratePR}
                      disabled={isGeneratingPR}
                      className="gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isGeneratingPR ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCopyPR}
                      className="gap-2"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <Textarea
                    value={pressReleaseContent}
                    onChange={(e) => {
                      setPressReleaseContent(e.target.value)
                      setPressReleaseSaved(false) // Mark as unsaved when edited
                    }}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={async () => {
                        startTransition(async () => {
                          const result = await updateCampaign(campaign.id, {
                            ...form.getValues(),
                            press_release_content: pressReleaseContent,
                            status: 'active'
                          })
                          if (result.success) {
                            const newNumber = pressReleaseNumber === 0 ? 1 : pressReleaseNumber
                            setPressReleaseNumber(newNumber)
                            setPressReleaseSaved(true)
                            toast({ title: 'Press release saved', description: `Press Release #${newNumber} has been saved.` })
                            router.refresh()
                          } else {
                            toast({ title: 'Error', description: result.error, variant: 'destructive' })
                          }
                        })
                      }} 
                      disabled={isPending || pressReleaseSaved}
                      className={`gap-2 ${pressReleaseSaved ? 'bg-green-600 hover:bg-green-600' : ''}`}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : pressReleaseSaved ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {pressReleaseSaved ? `Press Release #${pressReleaseNumber} Saved` : 'Save Press Release'}
                    </Button>
                    {pressReleaseSaved && (
                      <Button 
                        asChild
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Link href="/publications">
                          <Send className="h-4 w-4" />
                          Publish your Press Release
                        </Link>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No press release yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate an AI-powered press release based on your campaign details
                  </p>
                  <Button
                    onClick={handleGeneratePR}
                    disabled={isGeneratingPR}
                    className="gap-2"
                  >
                    <Sparkles className={`h-4 w-4 ${isGeneratingPR ? 'animate-pulse' : ''}`} />
                    {isGeneratingPR ? 'Generating...' : 'Generate Press Release'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Script Tab */}
        <TabsContent value="video-script">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                AI-Generated Video Script
              </CardTitle>
              <CardDescription>
                Generate a video script for your press release
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {videoScriptContent ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isGeneratingVideo ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                  <Textarea
                    value={videoScriptContent}
                    onChange={(e) => setVideoScriptContent(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={() => handleSave(form.getValues())} 
                    disabled={isPending}
                    className="gap-2"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Video Script
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No video script yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate an AI-powered video script based on your campaign
                  </p>
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="gap-2"
                  >
                    <Sparkles className={`h-4 w-4 ${isGeneratingVideo ? 'animate-pulse' : ''}`} />
                    {isGeneratingVideo ? 'Generating...' : 'Generate Video Script'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Select Publications</CardTitle>
              <CardDescription>
                Choose which publications to distribute your press release to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {publications.slice(0, 15).map((pub) => {
                  const isSelected = selectedPubs.includes(pub.id)
                  const rate = pub.is_free ? 0 : Math.round((pub.publication_tiers[0]?.publisher_rate || 0) * (1 + MARKUP_PERCENTAGE))
                  
                  return (
                    <div
                      key={pub.id}
                      onClick={() => handleTogglePublication(pub.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-green-500 bg-green-50' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{pub.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {pub.description}
                          </p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-green-500 bg-green-500' : ''
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-medium text-green-600">
                        {pub.is_free ? 'Free' : formatCurrency(rate)}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Cost Summary */}
              <div className="mt-6 p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Distribution Cost</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPubs.length} publication{selectedPubs.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(distributionCost)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Publish Tab */}
        <TabsContent value="publish">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Free Newsroom */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  PR Hub Newsroom
                  <Badge className="bg-green-100 text-green-800">Free</Badge>
                </CardTitle>
                <CardDescription>
                  Publish your press release to our free newsroom
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Publish to Newsroom</p>
                    <p className="text-sm text-muted-foreground">
                      Make your press release publicly visible
                    </p>
                  </div>
                  <Switch
                    checked={publishToNewsroom}
                    onCheckedChange={handleToggleNewsroom}
                    disabled={!pressReleaseContent}
                  />
                </div>

                {!pressReleaseContent && (
                  <p className="text-sm text-muted-foreground italic">
                    Generate a press release first to enable publishing
                  </p>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube Video URL (optional)</label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add a video to display alongside your press release
                  </p>
                </div>

                {publishToNewsroom && (
                  <Link href="/newsroom">
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View in Newsroom
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Paid Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Paid Distribution</CardTitle>
                <CardDescription>
                  Distribute to selected publications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Selected Publications</p>
                  {selectedPubs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No publications selected. Go to the Distribution tab to select publications.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedPubs.map(id => {
                        const pub = publications.find(p => p.id === id)
                        return pub ? (
                          <Badge key={id} variant="secondary">
                            {pub.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(distributionCost)}
                    </span>
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={selectedPubs.length === 0 || !pressReleaseContent}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
