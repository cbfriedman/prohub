'use client'

import { useState, useMemo, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, ShoppingCart, Loader2, Check } from 'lucide-react'
import { addBulkToCart, getCartItems, type BulkCartItem } from '@/app/actions/cart'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { applyMarkup, formatCurrency, formatCirculation, FOCUS_COLORS, GEOGRAPHIC_COLORS } from '@/lib/constants'
import type { PublicationWithTiers } from '@/app/actions/publications'
import type { Focus, Geographic } from '@/lib/validations/schemas'

interface PublicationsTableProps {
  publications: PublicationWithTiers[]
  isAdmin: boolean
  recommendedIds?: string[]
}

type SelectionType = 'sponsored' | 'editorial'
type SelectionsState = Record<string, Set<SelectionType>>

const columnHelper = createColumnHelper<PublicationWithTiers>()

export function PublicationsTable({ publications, isAdmin, recommendedIds = [] }: PublicationsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [addedToCart, setAddedToCart] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [focusFilter, setFocusFilter] = useState<string>('all')
  const [geoFilter, setGeoFilter] = useState<string>('all')
  const [selections, setSelections] = useState<SelectionsState>({})
  const [cartLoaded, setCartLoaded] = useState(false)

  // Load existing cart items into selections on mount
  useEffect(() => {
    const loadCartSelections = async () => {
      const cartItems = await getCartItems()
      const newSelections: SelectionsState = {}
      
      for (const item of cartItems) {
        const placementType = (item as { placement_type?: string }).placement_type
        if (placementType && (placementType === 'sponsored' || placementType === 'editorial')) {
          if (!newSelections[item.publication_id]) {
            newSelections[item.publication_id] = new Set<SelectionType>()
          }
          newSelections[item.publication_id].add(placementType)
        }
      }
      
      setSelections(newSelections)
      setCartLoaded(true)
    }
    
    loadCartSelections()
  }, [])

  const toggleSelection = (pubId: string, type: SelectionType) => {
    setSelections(prev => {
      const current = prev[pubId] || new Set<SelectionType>()
      const updated = new Set(current)
      if (updated.has(type)) {
        updated.delete(type)
      } else {
        updated.add(type)
      }
      return { ...prev, [pubId]: updated }
    })
  }

  const isSelected = (pubId: string, type: SelectionType): boolean => {
    return selections[pubId]?.has(type) || false
  }

  const getPublicationRate = (pub: PublicationWithTiers, type: SelectionType): number => {
    if (pub.is_free) return 0
    
    // Use explicit rates if available, otherwise calculate from tier
    const pubWithRates = pub as PublicationWithTiers & { sponsored_rate?: number; editorial_rate?: number }
    
    if (type === 'sponsored' && pubWithRates.sponsored_rate) {
      return applyMarkup(pubWithRates.sponsored_rate, true)
    }
    if (type === 'editorial' && pubWithRates.editorial_rate) {
      return applyMarkup(pubWithRates.editorial_rate, true)
    }
    
    // Fallback to tier-based calculation
    const baseRate = Number(pub.publication_tiers[0]?.publisher_rate) || 0
    // Sponsored Article is full rate, Editorial Mention is 60% of rate
    const rate = type === 'sponsored' ? baseRate : baseRate * 0.6
    return applyMarkup(rate, true)
  }

  const getPublicationTotal = (pub: PublicationWithTiers): number => {
    const pubSelections = selections[pub.id]
    if (!pubSelections || pubSelections.size === 0) return 0
    let total = 0
    if (pubSelections.has('sponsored')) {
      total += getPublicationRate(pub, 'sponsored')
    }
    if (pubSelections.has('editorial')) {
      total += getPublicationRate(pub, 'editorial')
    }
    return total
  }

  const filteredData = useMemo(() => {
    const filtered = publications.filter((pub) => {
      const matchesFocus = focusFilter === 'all' || pub.focus === focusFilter
      const matchesGeo = geoFilter === 'all' || pub.geographic === geoFilter
      return matchesFocus && matchesGeo
    })
    
    // Sort recommended publications to the top
    if (recommendedIds.length > 0) {
      return [...filtered].sort((a, b) => {
        const aIsRecommended = recommendedIds.includes(a.id)
        const bIsRecommended = recommendedIds.includes(b.id)
        if (aIsRecommended && !bIsRecommended) return -1
        if (!aIsRecommended && bIsRecommended) return 1
        return 0
      })
    }
    
    return filtered
  }, [publications, focusFilter, geoFilter, recommendedIds])

  const grandTotal = useMemo(() => {
    return filteredData.reduce((sum, pub) => sum + getPublicationTotal(pub), 0)
  }, [filteredData, selections])

  const selectedCount = useMemo(() => {
    return Object.values(selections).filter(s => s.size > 0).length
  }, [selections])

  const handleAddToCart = () => {
    // Build cart items from selections
    const cartItems: BulkCartItem[] = []
    
    for (const [pubId, types] of Object.entries(selections)) {
      const pub = publications.find(p => p.id === pubId)
      if (!pub) continue
      
      for (const type of types) {
        cartItems.push({
          publication_id: pubId,
          publication_name: pub.name,
          type: type as 'sponsored' | 'editorial',
          price: getPublicationRate(pub, type),
        })
      }
    }
    
    if (cartItems.length === 0) return
    
    startTransition(async () => {
      const result = await addBulkToCart(cartItems)
      if (result.success) {
        setAddedToCart(true)
        toast({
          title: 'Added to cart',
          description: `${result.addedCount} item${result.addedCount !== 1 ? 's' : ''} added to your cart.`,
        })
        // Reset after 2 seconds
        setTimeout(() => {
          setAddedToCart(false)
          setSelections({})
        }, 2000)
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add items to cart',
          variant: 'destructive',
        })
      }
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Publication
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const isRecommended = recommendedIds.includes(row.original.id)
          return (
            <div className="min-w-[200px]">
              <div className="font-medium flex items-center gap-2">
                {row.original.name}
                {isRecommended && (
                  <Badge className="bg-blue-600 text-white text-xs">Recommended</Badge>
                )}
                {row.original.is_free && (
                  <Badge className="bg-green-600 text-white text-xs">Free</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {row.original.description}
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor('frequency', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Frequency
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
            )}
          </Button>
        ),
        cell: ({ row, getValue }) => {
          const frequency = getValue() as string | null
          const medium = (row.original as PublicationWithTiers & { medium?: string }).medium
          const mediumLabel = medium === 'print' ? 'Print' : medium === 'broadcast' ? 'Broadcast' : 'Digital'
          const mediumColor = medium === 'print' ? 'text-amber-700' : medium === 'broadcast' ? 'text-purple-700' : 'text-blue-700'
          return (
            <div className="text-sm">
              <span className="capitalize">{frequency || 'N/A'}</span>
              <span className={`ml-1 ${mediumColor} font-medium`}>({mediumLabel})</span>
            </div>
          )
        },
      }),
      columnHelper.accessor('geographic', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Geographic
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => (
          <Badge className={GEOGRAPHIC_COLORS[getValue() as Geographic]}>
            {getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('circulation', {
        header: ({ column }) => (
          <div className="flex justify-center w-24">
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Circulation
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
              )}
            </Button>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="w-24 text-center">
            <span className="font-medium">
              {formatCirculation(getValue() ?? 0)}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'sponsored',
        header: () => (
          <div className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center gap-1 cursor-help">
                    <div>
                      <div className="font-medium">Sponsored</div>
                      <div className="font-medium">Article</div>
                    </div>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-semibold">Sponsored Article</p>
                  <p className="text-xs mt-1">Full control over content. Labeled as sponsored. Higher CTR but readers know it&apos;s paid.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        cell: ({ row }) => {
          const rate = getPublicationRate(row.original, 'sponsored')
          const selected = isSelected(row.original.id, 'sponsored')
          return (
            <div className="flex items-center justify-center gap-2">
              <Checkbox
                checked={selected}
                onCheckedChange={() => toggleSelection(row.original.id, 'sponsored')}
                aria-label={`Select sponsored article for ${row.original.name}`}
              />
              <span className={`font-medium ${selected ? 'text-green-600' : 'text-muted-foreground'}`}>
                {formatCurrency(rate)}
              </span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: 'editorial',
        header: () => (
          <div className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center gap-1 cursor-help">
                    <div>
                      <div className="font-medium">Editorial</div>
                      <div className="font-medium">Mention</div>
                    </div>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-semibold">Editorial Mention</p>
                  <p className="text-xs mt-1">Publication writes about you. Higher credibility as organic coverage. Better conversion quality.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        cell: ({ row }) => {
          const rate = getPublicationRate(row.original, 'editorial')
          const selected = isSelected(row.original.id, 'editorial')
          return (
            <div className="flex items-center justify-center gap-2">
              <Checkbox
                checked={selected}
                onCheckedChange={() => toggleSelection(row.original.id, 'editorial')}
                aria-label={`Select editorial mention for ${row.original.name}`}
              />
              <span className={`font-medium ${selected ? 'text-green-600' : 'text-muted-foreground'}`}>
                {formatCurrency(rate)}
              </span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: 'cpm',
        header: () => <div className="text-right font-medium">CPM</div>,
        cell: ({ row }) => {
          const total = getPublicationTotal(row.original)
          const circulation = row.original.circulation || 0
          // CPM = (Total Cost / Circulation) * 1000
          const cpm = total > 0 && circulation > 0 ? (total / circulation) * 1000 : 0
          return (
            <span className={`font-medium text-right block ${total > 0 ? 'text-blue-600' : 'text-muted-foreground'}`}>
              {total > 0 ? `$${cpm.toFixed(2)}` : '-'}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'total',
        header: () => <div className="text-right font-medium">Total</div>,
        cell: ({ row }) => {
          const total = getPublicationTotal(row.original)
          return (
            <span className={`font-bold text-right block ${total > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
              {total > 0 ? formatCurrency(total) : '-'}
            </span>
          )
        },
      }),
    ],
    [isAdmin, recommendedIds, selections]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search publications..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={focusFilter} onValueChange={setFocusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Focus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Focus</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="startup">Startup</SelectItem>
          </SelectContent>
        </Select>
        <Select value={geoFilter} onValueChange={setGeoFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Geographic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coverage</SelectItem>
            <SelectItem value="international">International</SelectItem>
            <SelectItem value="nationwide">Nationwide</SelectItem>
            <SelectItem value="regional">Regional</SelectItem>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>
        
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={header.column.id === 'actions' || header.column.id === 'total' ? 'text-right' : ''}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={getPublicationTotal(row.original) > 0 ? 'bg-green-50/50' : ''}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.id === 'actions' || cell.column.id === 'total' ? 'text-right' : ''}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No publications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Grand Total Footer */}
      <div className="sticky bottom-0 bg-card border rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {selectedCount > 0 
                ? `${selectedCount} publication${selectedCount !== 1 ? 's' : ''} selected`
                : 'Select publications to add to your campaign'
              }
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Grand Total</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(grandTotal)}
              </div>
            </div>
            <Button 
              size="lg"
              className={`gap-2 ${addedToCart ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={selectedCount === 0 || isPending || addedToCart}
              onClick={handleAddToCart}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : addedToCart ? (
                <Check className="h-5 w-5" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              {isPending ? 'Adding...' : addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {/* Publication count */}
      <div className="text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} publications
        {recommendedIds.length > 0 && (
          <span className="ml-2">
            ({recommendedIds.filter(id => filteredData.some(p => p.id === id)).length} recommended)
          </span>
        )}
      </div>
    </div>
  )
}
