'use client'

import Link from 'next/link'
import { 
  TrendingUp,
  Target,
  Users,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Megaphone,
  Newspaper,
  Star,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTZzLTItNC0yLTYgMi00IDItNi0yLTQtMi02IDItNCAyLTYtMi00LTItNmgyYzAgMiAyIDQgMiA2cy0yIDQtMiA2IDIgNCAyIDYtMiA0LTIgNiAyIDQgMiA2LTIgNC0yIDZoLTJjMC0yLTItNC0yLTZzMi00IDItNi0yLTQtMi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative px-6 py-20 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-green-600/20 text-green-400 border-green-600/30 px-4 py-1.5">
              Trusted by 500+ companies
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Why PR Hub Outperforms{' '}
              <span className="text-green-400">Traditional Advertising</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto text-pretty">
              Get guaranteed editorial placements on premium publications. 
              Combine the credibility of earned media with the predictability of paid advertising.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link href="/auth/login">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 px-8">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/publications">
                <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 gap-2">
                  Browse Publications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">The Numbers Speak for Themselves</h2>
            <p className="mt-2 text-muted-foreground">PR campaigns consistently outperform traditional advertising</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/10 mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-4xl font-bold text-green-600">4.7x</span>
                <p className="text-sm text-muted-foreground mt-2">Higher ROI than paid ads</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-4xl font-bold text-blue-600">3x</span>
                <p className="text-sm text-muted-foreground mt-2">Better lead close rate</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/10 mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-4xl font-bold text-purple-600">88%</span>
                <p className="text-sm text-muted-foreground mt-2">Buyers trust earned media</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200 bg-amber-50/50">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 mx-auto mb-4">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-4xl font-bold text-amber-600">20x</span>
                <p className="text-sm text-muted-foreground mt-2">More AI search citations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">PR Hub vs. Traditional Advertising</h2>
            <p className="mt-2 text-muted-foreground">See how guaranteed PR placements compare to standard paid ads</p>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 bg-slate-100 p-4 text-sm font-semibold border-b">
                <div>Feature</div>
                <div className="text-center text-green-600">PR Hub</div>
                <div className="text-center text-slate-500">Traditional Ads</div>
              </div>
              <div className="divide-y">
                {[
                  { feature: 'Consumer Trust', icon: ShieldCheck, prHub: 'High', traditional: 'Low', prHubGood: true },
                  { feature: 'Guaranteed Placement', icon: Target, prHub: 'Yes', traditional: 'Yes', prHubGood: true, traditionalGood: true },
                  { feature: 'Lead Quality', icon: Users, prHub: '3x Higher', traditional: 'Baseline', prHubGood: true },
                  { feature: 'AI Search Visibility', icon: Zap, prHub: '20x More', traditional: 'Rarely Cited', prHubGood: true },
                  { feature: 'Average ROI', icon: BarChart3, prHub: '4.7x', traditional: '1x', prHubGood: true },
                  { feature: 'Brand Credibility', icon: Star, prHub: 'Editorial Authority', traditional: 'Paid Message', prHubGood: true },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-3 p-4 text-sm items-center">
                    <div className="flex items-center gap-2">
                      <row.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{row.feature}</span>
                    </div>
                    <div className="text-center">
                      {row.prHubGood ? (
                        <Badge className="bg-green-600 text-white">{row.prHub}</Badge>
                      ) : (
                        <Badge variant="secondary">{row.prHub}</Badge>
                      )}
                    </div>
                    <div className="text-center">
                      {row.traditionalGood ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <Badge variant="secondary">{row.traditional}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How PR Hub Works</h2>
            <p className="mt-2 text-muted-foreground">Three simple steps to get your story in front of millions</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 mb-4">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <CardTitle>1. Create Your Campaign</CardTitle>
                <CardDescription>
                  Use our AI-powered tools to generate professional press releases from your website or key talking points.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 mb-4">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <CardTitle>2. Select Publications</CardTitle>
                <CardDescription>
                  Browse 60+ premium publications with transparent pricing. Choose placements that match your audience.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>3. Get Published</CardTitle>
                <CardDescription>
                  We guarantee placement on your selected publications. Track your coverage and measure results.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to amplify your message?
          </h2>
          <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
            Join hundreds of companies using PR Hub to get guaranteed coverage on premium publications.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 gap-2 px-8">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/newsroom">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                View Free Newsroom
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-8 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Megaphone className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">PR Hub</span>
          </div>
          <p className="text-sm">2026 PR Hub. Guaranteed press coverage for modern businesses.</p>
        </div>
      </footer>
    </div>
  )
}
