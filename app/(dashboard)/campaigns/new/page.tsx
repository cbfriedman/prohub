'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  Globe, 
  FileText, 
  Wand2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createCampaign, updateCampaign } from '@/app/actions/campaigns'
import { scanWebsite, generatePressRelease } from '@/app/actions/ai'
import { useToast } from '@/hooks/use-toast'
import { 
  GEOGRAPHIC_COVERAGE_OPTIONS, 
  US_REGIONS, 
  US_STATES, 
  US_COUNTIES,
  getStatesByRegion,
  getCountiesByState
} from '@/lib/data/geographic'

// Helper to normalize URLs (add https:// if missing)
const normalizeUrl = (url: string): string => {
  if (!url) return url
  url = url.trim()
  if (url.startsWith('www.')) {
    return `https://${url}`
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

// Form schema
const campaignFormSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  target_audience: z.string().optional(),
  key_messages: z.string().optional(),
  website_url: z.string()
    .transform(normalizeUrl)
    .pipe(z.string().url('Please enter a valid URL'))
    .optional()
    .or(z.literal('')),
  geo_coverage: z.enum(['international', 'national', 'regional', 'state', 'local']).optional(),
  geo_regions: z.array(z.string()).optional(),
  geo_states: z.array(z.string()).optional(),
  geo_counties: z.array(z.string()).optional(),
})

type CampaignFormData = z.infer<typeof campaignFormSchema>

export default function NewCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isScanning, setIsScanning] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [websiteContent, setWebsiteContent] = useState<string | null>(null)
  const [pressRelease, setPressRelease] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('details')
  const [scanError, setScanError] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  
  // Geographic selection state
  const [selectedStatesForCounties, setSelectedStatesForCounties] = useState<string>('')

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: '',
      target_audience: '',
      key_messages: '',
      website_url: '',
      geo_coverage: undefined,
      geo_regions: [],
      geo_states: [],
      geo_counties: [],
    },
  })

  const geoCoverage = form.watch('geo_coverage')
  const selectedRegions = form.watch('geo_regions') || []
  const selectedStates = form.watch('geo_states') || []
  const selectedCounties = form.watch('geo_counties') || []

  const handleScanWebsite = async () => {
    const url = form.getValues('website_url')
    if (!url) {
      toast({
        title: 'URL Required',
        description: 'Please enter a website URL to scan.',
        variant: 'destructive',
      })
      return
    }

    setIsScanning(true)
    setScanError(null)
    
    try {
      const result = await scanWebsite({ url })
      if (result.success && result.content) {
        setWebsiteContent(result.content)
        toast({
          title: 'Website Scanned',
          description: 'Key information has been extracted from the website.',
        })
      } else {
        setScanError(result.error || 'Failed to scan website')
      }
    } catch {
      setScanError('An unexpected error occurred')
    } finally {
      setIsScanning(false)
    }
  }

  const handleGeneratePressRelease = async () => {
    const values = form.getValues()
    if (!values.name) {
      toast({
        title: 'Campaign Name Required',
        description: 'Please enter a campaign name before generating.',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    setGenerateError(null)

    try {
      const result = await generatePressRelease({
        campaign_name: values.name,
        target_audience: values.target_audience,
        key_messages: values.key_messages,
        website_content: websiteContent || undefined,
      })

      if (result.success && result.content) {
        setPressRelease(result.content)
        setActiveTab('preview')
        toast({
          title: 'Press Release Generated',
          description: 'Your AI-generated press release is ready for review.',
        })
      } else {
        setGenerateError(result.error || 'Failed to generate press release')
      }
    } catch {
      setGenerateError('An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = (data: CampaignFormData) => {
    startTransition(async () => {
      const result = await createCampaign({
        name: data.name,
        target_audience: data.target_audience,
        key_messages: data.key_messages,
        geo_coverage: data.geo_coverage,
        geo_regions: data.geo_regions,
        geo_states: data.geo_states,
        geo_counties: data.geo_counties,
      })

      if (result.success && result.data) {
        if (pressRelease) {
          await updateCampaign(result.data.id, {
            press_release_content: pressRelease,
          })
        }

        toast({
          title: 'Campaign Created',
          description: 'Your campaign has been created successfully.',
        })
        router.push(`/campaigns/${result.data.id}`)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create campaign',
          variant: 'destructive',
        })
      }
    })
  }

  const toggleArrayValue = (
    fieldName: 'geo_regions' | 'geo_states' | 'geo_counties',
    value: string
  ) => {
    const current = form.getValues(fieldName) || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    form.setValue(fieldName, updated)
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/campaigns" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Create New Campaign</h1>
        <p className="text-muted-foreground mt-1">
          Generate AI-powered press releases from your website or key talking points
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="gap-2">
                <FileText className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="generate" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2" disabled={!pressRelease}>
                <CheckCircle2 className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Step 1: Campaign Details */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                  <CardDescription>
                    Enter basic information about your PR campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Product Launch 2026" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for your PR campaign
                        </FormDescription>
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
                          <Textarea
                            placeholder="Describe your target audience (e.g., tech startups, enterprise CTOs, healthcare professionals)..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Who should this press release reach?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Geographic Targeting Section */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Geographic Targeting</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      What geographical area would you like this PR campaign to reach?
                    </p>

                    <FormField
                      control={form.control}
                      name="geo_coverage"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid gap-3"
                            >
                              {GEOGRAPHIC_COVERAGE_OPTIONS.map((option) => (
                                <div key={option.value} className="flex items-start space-x-3">
                                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                                  <Label htmlFor={option.value} className="flex flex-col cursor-pointer">
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-sm text-muted-foreground">{option.description}</span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Regional Selection */}
                    {geoCoverage === 'regional' && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                        <Label className="font-medium">Select Regions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {US_REGIONS.map((region) => (
                            <div key={region.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`region-${region.value}`}
                                checked={selectedRegions.includes(region.value)}
                                onCheckedChange={() => toggleArrayValue('geo_regions', region.value)}
                              />
                              <Label htmlFor={`region-${region.value}`} className="cursor-pointer">
                                {region.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {selectedRegions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedRegions.map(r => {
                              const region = US_REGIONS.find(reg => reg.value === r)
                              return (
                                <Badge key={r} variant="secondary" className="gap-1">
                                  {region?.label}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => toggleArrayValue('geo_regions', r)}
                                  />
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* State Selection */}
                    {geoCoverage === 'state' && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                        <Label className="font-medium">Select States & Territories</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                          {US_STATES.map((state) => (
                            <div key={state.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`state-${state.value}`}
                                checked={selectedStates.includes(state.value)}
                                onCheckedChange={() => toggleArrayValue('geo_states', state.value)}
                              />
                              <Label htmlFor={`state-${state.value}`} className="cursor-pointer text-sm">
                                {state.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {selectedStates.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedStates.map(s => {
                              const state = US_STATES.find(st => st.value === s)
                              return (
                                <Badge key={s} variant="secondary" className="gap-1">
                                  {state?.label}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => toggleArrayValue('geo_states', s)}
                                  />
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Local/County Selection */}
                    {geoCoverage === 'local' && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                        <Label className="font-medium">Select State, then Counties</Label>
                        
                        {/* State dropdown for counties */}
                        <Select
                          value={selectedStatesForCounties}
                          onValueChange={setSelectedStatesForCounties}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state to view counties" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.filter(s => US_COUNTIES[s.value]).map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* County checkboxes */}
                        {selectedStatesForCounties && US_COUNTIES[selectedStatesForCounties] && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            {US_COUNTIES[selectedStatesForCounties].map((county) => (
                              <div key={county.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`county-${county.value}`}
                                  checked={selectedCounties.includes(county.value)}
                                  onCheckedChange={() => toggleArrayValue('geo_counties', county.value)}
                                />
                                <Label htmlFor={`county-${county.value}`} className="cursor-pointer text-sm">
                                  {county.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedCounties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedCounties.map(c => {
                              // Find county label from all states
                              let countyLabel = c
                              for (const [stateCode, counties] of Object.entries(US_COUNTIES)) {
                                const found = counties.find(county => county.value === c)
                                if (found) {
                                  countyLabel = `${found.label} (${stateCode})`
                                  break
                                }
                              }
                              return (
                                <Badge key={c} variant="secondary" className="gap-1">
                                  {countyLabel}
                                  <X 
                                    className="h-3 w-3 cursor-pointer" 
                                    onClick={() => toggleArrayValue('geo_counties', c)}
                                  />
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('generate')}
                      className="gap-2"
                    >
                      Continue to Generate
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Generate Content */}
            <TabsContent value="generate">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Option A: Scan Website */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Scan Website
                    </CardTitle>
                    <CardDescription>
                      Extract key information from your company website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="website_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input 
                              type="url" 
                              placeholder="https://example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {scanError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{scanError}</AlertDescription>
                      </Alert>
                    )}

                    {websiteContent && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          Website scanned successfully! Key information extracted.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleScanWebsite}
                      disabled={isScanning}
                    >
                      {isScanning ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                      {isScanning ? 'Scanning...' : 'Scan Website'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Option B: Key Talking Points */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Key Talking Points
                    </CardTitle>
                    <CardDescription>
                      Enter the main points for your press release
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="key_messages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Messages</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your key messages, one per line:&#10;&#10;- New product announcement&#10;- Key features and benefits&#10;- Company milestones&#10;- Quotes from leadership"
                              rows={8}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The AI will incorporate these points into your press release
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Generate Button */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  {generateError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{generateError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Click below to generate an AI-powered press release using the information provided above.
                    </p>
                    <Button
                      type="button"
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={handleGeneratePressRelease}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                      {isGenerating ? 'Generating Press Release...' : 'Generate Press Release with AI'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3: Preview & Save */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Press Release Preview
                  </CardTitle>
                  <CardDescription>
                    Review and edit your AI-generated press release before saving
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 border">
                    <Textarea
                      value={pressRelease || ''}
                      onChange={(e) => setPressRelease(e.target.value)}
                      rows={20}
                      className="font-mono text-sm bg-background"
                      placeholder="Your press release will appear here..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('generate')}
                      >
                        Back to Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGeneratePressRelease}
                        disabled={isGenerating}
                        className="gap-2"
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        Regenerate
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="gap-2"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Save Campaign & Press Release
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
