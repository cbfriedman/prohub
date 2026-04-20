'use client'

import Link from 'next/link'
import { Newspaper, Send, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { publications } from '@/lib/data/publications'

export default function AdminDashboardPage() {
  const totalPublications = publications.length
  const freePublications = publications.filter(p =>
    p.tiers?.every(t => t.publisherRate === 0) || p.tiers?.length === 0
  ).length
  const paidPublications = totalPublications - freePublications

  const totalRevenue = publications.reduce((sum, p) => {
    const topRate = Math.max(...(p.tiers?.map(t => t.publisherRate) ?? [0]))
    return sum + topRate
  }, 0)

  const stats = [
    {
      title: 'Total Publications',
      value: totalPublications,
      description: 'All publications in the network',
      icon: Newspaper,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Paid Publications',
      value: paidPublications,
      description: 'With advertising rates',
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      title: 'Free Placements',
      value: freePublications,
      description: 'No publisher cost',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Pending Submissions',
      value: 1,
      description: 'Awaiting action',
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ]

  const quickLinks = [
    {
      href: '/admin/publications',
      title: 'Publications',
      description: 'View all publications with publisher rates (no markup). Includes free placements.',
      icon: Newspaper,
      badge: `${totalPublications} total`,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      href: '/admin/submissions',
      title: 'Submission Portal',
      description: 'Review paid orders and submit press releases to publications on behalf of clients.',
      icon: Send,
      badge: '1 pending',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-amber-500 text-white text-xs">Admin</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Internal operations overview — all data shown at publisher rates (before markup).
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Portal Sections</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-amber-50 transition-colors">
                        <link.icon className="h-5 w-5 text-slate-600 group-hover:text-amber-600 transition-colors" />
                      </div>
                      <CardTitle className="text-base">{link.title}</CardTitle>
                    </div>
                    <Badge className={link.badgeColor}>{link.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info box */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <TrendingUp className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 text-sm">Pricing Note</p>
              <p className="text-amber-800 text-sm mt-1">
                All rates shown in the admin portal are <strong>publisher rates</strong> (your actual cost).
                Client-facing prices include a <strong>20% markup</strong> on top of these rates.
                The Publications page displays both for reference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
