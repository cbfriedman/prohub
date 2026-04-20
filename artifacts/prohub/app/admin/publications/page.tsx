'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, DollarSign, Users, Tag, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { publications, formatCurrency, formatCirculation, applyMarkup } from '@/lib/data/publications'

const FOCUS_COLORS: Record<string, string> = {
  tech: 'bg-blue-100 text-blue-800',
  business: 'bg-emerald-100 text-emerald-800',
  entertainment: 'bg-purple-100 text-purple-800',
  general: 'bg-slate-100 text-slate-800',
  science: 'bg-amber-100 text-amber-800',
  startup: 'bg-rose-100 text-rose-800',
}

const GEO_COLORS: Record<string, string> = {
  nationwide: 'bg-green-100 text-green-800',
  regional: 'bg-orange-100 text-orange-800',
  local: 'bg-cyan-100 text-cyan-800',
  international: 'bg-indigo-100 text-indigo-800',
}

export default function AdminPublicationsPage() {
  const [search, setSearch] = useState('')
  const [focusFilter, setFocusFilter] = useState('all')
  const [geoFilter, setGeoFilter] = useState('all')
  const [freeFilter, setFreeFilter] = useState('all')

  const filtered = useMemo(() => {
    return publications.filter(pub => {
      const matchesSearch =
        search === '' ||
        pub.name.toLowerCase().includes(search.toLowerCase()) ||
        pub.description?.toLowerCase().includes(search.toLowerCase()) ||
        pub.audience?.toLowerCase().includes(search.toLowerCase())

      const matchesFocus = focusFilter === 'all' || pub.focus === focusFilter
      const matchesGeo = geoFilter === 'all' || pub.geographic === geoFilter

      const isFree = pub.tiers?.every(t => t.publisherRate === 0) ?? true
      const matchesFree =
        freeFilter === 'all' ||
        (freeFilter === 'free' && isFree) ||
        (freeFilter === 'paid' && !isFree)

      return matchesSearch && matchesFocus && matchesGeo && matchesFree
    })
  }, [search, focusFilter, geoFilter, freeFilter])

  const totalFree = publications.filter(p => p.tiers?.every(t => t.publisherRate === 0) ?? true).length

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-amber-500 text-white text-xs">Admin</Badge>
          <Badge variant="outline" className="text-xs">Publisher Rates</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">All Publications</h1>
        <p className="text-muted-foreground mt-1">
          Showing publisher rates (before 20% markup). Includes all {publications.length} publications — {totalFree} free.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Publications</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publications.length}</div>
            <p className="text-xs text-muted-foreground">All in network</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Free Placements</CardTitle>
            <Tag className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{totalFree}</div>
            <p className="text-xs text-muted-foreground">No publisher cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Currently Showing</CardTitle>
            <Filter className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filtered.length}</div>
            <p className="text-xs text-muted-foreground">After filters</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={freeFilter} onValueChange={setFreeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Cost type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={focusFilter} onValueChange={setFocusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Focus</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={geoFilter} onValueChange={setGeoFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Geographic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Geographies</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="nationwide">Nationwide</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Publications ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[220px]">Publication</TableHead>
                  <TableHead>Focus / Geography</TableHead>
                  <TableHead className="text-right">Circulation</TableHead>
                  <TableHead>Placement Tiers</TableHead>
                  <TableHead className="text-right text-amber-700 bg-amber-50">Publisher Rate</TableHead>
                  <TableHead className="text-right text-slate-500 bg-slate-50">Client Rate (+20%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(pub => {
                  const isFree = pub.tiers?.every(t => t.publisherRate === 0) ?? true

                  return (
                    <TableRow key={pub.id} className="align-top">
                      <TableCell className="py-4">
                        <div>
                          <p className="font-semibold text-sm">{pub.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pub.description}</p>
                          {isFree && (
                            <Badge className="mt-1 bg-emerald-100 text-emerald-700 text-xs">Free</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                          {pub.focus && (
                            <Badge className={`text-xs w-fit ${FOCUS_COLORS[pub.focus] ?? 'bg-slate-100 text-slate-700'}`}>
                              {pub.focus}
                            </Badge>
                          )}
                          {pub.geographic && (
                            <Badge className={`text-xs w-fit ${GEO_COLORS[pub.geographic] ?? 'bg-slate-100 text-slate-700'}`}>
                              {pub.geographic}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 font-mono text-sm">
                        {pub.circulation ? formatCirculation(pub.circulation) : '—'}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          {pub.tiers?.map(tier => (
                            <p key={tier.id} className="text-xs text-muted-foreground">
                              {tier.name}
                            </p>
                          )) ?? <p className="text-xs text-muted-foreground">—</p>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 bg-amber-50/30">
                        <div className="space-y-1">
                          {pub.tiers?.map(tier => (
                            <p key={tier.id} className={`text-xs font-semibold ${tier.publisherRate === 0 ? 'text-emerald-600' : 'text-amber-700'}`}>
                              {tier.publisherRate === 0 ? 'Free' : formatCurrency(tier.publisherRate)}
                            </p>
                          )) ?? <p className="text-xs font-semibold text-emerald-600">Free</p>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 bg-slate-50/30">
                        <div className="space-y-1">
                          {pub.tiers?.map(tier => (
                            <p key={tier.id} className={`text-xs ${tier.publisherRate === 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                              {tier.publisherRate === 0 ? 'Free' : formatCurrency(applyMarkup(tier.publisherRate))}
                            </p>
                          )) ?? <p className="text-xs text-emerald-600">Free</p>}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No publications match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
