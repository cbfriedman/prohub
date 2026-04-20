'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Radio, 
  RefreshCw, 
  ExternalLink, 
  Plus,
  FileText,
  Play
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface NewsroomPost {
  id: string
  title: string
  company_name: string
  excerpt: string | null
  content: string
  youtube_url: string | null
  published_at: string | null
}

interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
}

const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Tech Giants Report Strong Q1 Earnings Amid AI Boom',
    source: 'Reuters',
    url: 'https://reuters.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    title: 'Federal Reserve Signals Potential Rate Cuts Later This Year',
    source: 'AP News',
    url: 'https://apnews.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3',
    title: 'Global Markets Rally on Positive Economic Data',
    source: 'Reuters',
    url: 'https://reuters.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '4',
    title: 'New Climate Agreement Reached at International Summit',
    source: 'AP News',
    url: 'https://apnews.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: '5',
    title: 'Healthcare Innovation: Breakthrough in Cancer Treatment',
    source: 'Reuters',
    url: 'https://reuters.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
]

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  return date.toLocaleDateString()
}

interface Props {
  posts: NewsroomPost[]
}

export function NewsroomClient({ posts }: Props) {
  const [newsItems] = useState<NewsItem[]>(mockNewsItems)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshNews = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">PR Hub Newsroom</h1>
          <Badge className="bg-green-100 text-green-800">Free Publication</Badge>
          <Badge variant="outline" className="border-green-500 text-green-600 gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Official press releases from companies using PR Hub - Published free
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Press Releases */}
        <div className="lg:col-span-2 space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No press releases published yet</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-md">
                  Create a campaign and publish it to appear here for free
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
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{post.company_name}</CardTitle>
                        <CardDescription>
                          Published {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unknown'}
                        </CardDescription>
                      </div>
                      {post.youtube_url && (
                        <Badge variant="outline" className="gap-1">
                          <Play className="h-3 w-3" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt || post.content.substring(0, 200) + '...'}
                    </p>
                    
                    {post.youtube_url && (
                      <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                        <iframe
                          src={post.youtube_url.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <PressReleaseModal post={post} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily News Wire */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Radio className="h-5 w-5 text-green-600" />
                  Daily News Wire
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefreshNews}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <CardDescription>
                Live headlines from Reuters & AP - Updated {formatTimeAgo(lastRefresh.toISOString())}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {newsItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 group-hover:text-green-600 transition-colors">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="font-medium">{item.source}</span>
                          <span>-</span>
                          <span>{formatTimeAgo(item.publishedAt)}</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Get Your Story Here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Publish your press release to the PR Hub Newsroom for free. 
                Reach our growing audience of industry professionals and media.
              </p>
              <Link href="/campaigns/new">
                <Button className="w-full gap-2 bg-green-600 text-white hover:bg-green-700">
                  <Plus className="h-4 w-4" />
                  Create Free Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PressReleaseModal({ post }: { post: NewsroomPost }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Read Full Release
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
          <DialogDescription>
            {post.company_name} - Published {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unknown'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {post.content}
          </pre>
        </div>
        {post.youtube_url && (
          <div className="mt-6 aspect-video rounded-lg overflow-hidden">
            <iframe
              src={post.youtube_url.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
