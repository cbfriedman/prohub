'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  CreditCard, 
  Loader2,
  FileText,
  Megaphone,
  Package,
  RefreshCw,
  Calendar,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { format, addDays } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCartItems, removeFromCart, clearCart, updateCartItemType, updateCartItemScheduling, type CartItemWithDetails } from '@/app/actions/cart'
import { formatCurrency } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'

interface SchedulingOptions {
  timing: 'standard' | 'rush'
  frequency: 'once' | 'weekly' | 'monthly'
  startDate: Date | undefined
  endDate: Date | undefined
}

type ItemScheduling = Record<string, SchedulingOptions>

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState<CartItemWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scheduling, setScheduling] = useState<ItemScheduling>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    setIsLoading(true)
    const cartItems = await getCartItems()
    setItems(cartItems)
    setIsLoading(false)
  }

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      const result = await removeFromCart(itemId)
      if (result.success) {
        setItems(items.filter(item => item.id !== itemId))
        toast({ title: 'Item removed', description: 'Item has been removed from your cart.' })
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const handleClearCart = () => {
    startTransition(async () => {
      const result = await clearCart()
      if (result.success) {
        setItems([])
        toast({ title: 'Cart cleared', description: 'All items have been removed from your cart.' })
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const handleTypeChange = (itemId: string, newType: 'sponsored' | 'editorial', currentPrice: number) => {
    // Calculate new price based on type change
    // If switching from sponsored to editorial, price = 60% of sponsored
    // If switching from editorial to sponsored, price = editorial / 0.6
    const item = items.find(i => i.id === itemId)
    if (!item) return
    
    const currentType = (item as { placement_type?: string }).placement_type
    if (currentType === newType) return
    
    let newPrice: number
    if (newType === 'editorial') {
      // Switching to editorial: 60% of sponsored price
      newPrice = currentPrice * 0.6
    } else {
      // Switching to sponsored: editorial price / 0.6
      newPrice = currentPrice / 0.6
    }
    
    startTransition(async () => {
      const result = await updateCartItemType(itemId, newType, newPrice)
      if (result.success) {
        // Update local state
        setItems(items.map(i => {
          if (i.id === itemId) {
            return { 
              ...i, 
              placement_type: newType,
              price: newPrice 
            } as CartItemWithDetails
          }
          return i
        }))
        toast({ title: 'Updated', description: `Changed to ${newType === 'sponsored' ? 'Sponsored Article' : 'Editorial Mention'}` })
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    })
  }

  const getItemScheduling = (item: CartItemWithDetails): SchedulingOptions => {
    // First check local state, then fall back to database values
    const localScheduling = scheduling[item.id]
    if (localScheduling) return localScheduling
    
    return {
      timing: (item.timing as 'standard' | 'rush') || 'standard',
      frequency: (item.frequency as 'once' | 'weekly' | 'monthly') || 'once',
      startDate: item.preferred_date ? new Date(item.preferred_date) : undefined,
      endDate: item.end_date ? new Date(item.end_date) : undefined,
    }
  }

  const updateScheduling = (itemId: string, updates: Partial<SchedulingOptions>) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    
    const currentScheduling = getItemScheduling(item)
    const newScheduling = { ...currentScheduling, ...updates }
    
    setScheduling(prev => ({
      ...prev,
      [itemId]: newScheduling
    }))
    
    // Persist to database
    startTransition(async () => {
      await updateCartItemScheduling(itemId, {
        timing: newScheduling.timing,
        frequency: newScheduling.frequency,
        preferredDate: newScheduling.startDate?.toISOString().split('T')[0] || null,
        endDate: newScheduling.endDate?.toISOString().split('T')[0] || null,
      })
    })
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  // Calculate price with rush fee
  const getItemPrice = (item: CartItemWithDetails): number => {
    const basePrice = Number(item.price)
    const itemScheduling = getItemScheduling(item)
    // Rush adds 50% premium
    return itemScheduling.timing === 'rush' ? basePrice * 1.5 : basePrice
  }

  const total = items.reduce((sum, item) => sum + getItemPrice(item), 0)

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-6 mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-center mb-6">
              Add publications to your cart to start your PR campaign.
            </p>
            <Button asChild>
              <Link href="/publications" className="gap-2">
                Browse Publications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingCart className="h-8 w-8" />
              Your Cart
            </h1>
            <p className="text-muted-foreground mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive gap-2"
            onClick={handleClearCart}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              // Type assertion to access placement_type
              const placementType = (item as { placement_type?: string }).placement_type as 'sponsored' | 'editorial' | undefined
              const itemScheduling = getItemScheduling(item)
              const itemPrice = getItemPrice(item)
              const isExpanded = expandedItems[item.id] || false
              
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{item.publications?.name || 'Unknown Publication'}</h3>
                          {itemScheduling.timing === 'rush' && (
                            <Badge className="bg-orange-500 text-white text-xs gap-1">
                              <Zap className="h-3 w-3" /> Rush
                            </Badge>
                          )}
                        </div>
                        {item.publications?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                            {item.publications.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Type:</span>
                            <Select
                              value={placementType || 'sponsored'}
                              onValueChange={(value) => handleTypeChange(item.id, value as 'sponsored' | 'editorial', Number(item.price))}
                              disabled={isPending}
                            >
                              <SelectTrigger className="w-[180px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sponsored">
                                  <div className="flex items-center gap-2">
                                    <Megaphone className="h-3 w-3" />
                                    Sponsored Article
                                  </div>
                                </SelectItem>
                                <SelectItem value="editorial">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3" />
                                    Editorial Mention
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Scheduling Options */}
                        <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(item.id)}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto text-blue-600 hover:text-blue-700">
                              <Calendar className="h-4 w-4" />
                              Scheduling Options
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-4">
                            <div className="border rounded-lg p-4 space-y-4 bg-slate-50">
                              {/* Timing */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Timing
                                </Label>
                                <RadioGroup
                                  value={itemScheduling.timing}
                                  onValueChange={(value) => updateScheduling(item.id, { timing: value as 'standard' | 'rush' })}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="standard" id={`${item.id}-standard`} />
                                    <Label htmlFor={`${item.id}-standard`} className="text-sm cursor-pointer">
                                      Standard (5-7 business days)
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="rush" id={`${item.id}-rush`} />
                                    <Label htmlFor={`${item.id}-rush`} className="text-sm cursor-pointer flex items-center gap-1">
                                      <Zap className="h-3 w-3 text-orange-500" />
                                      Rush (+50%, 1-2 days)
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              {/* Frequency */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Frequency</Label>
                                <Select
                                  value={itemScheduling.frequency}
                                  onValueChange={(value) => updateScheduling(item.id, { frequency: value as 'once' | 'weekly' | 'monthly' })}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="once">One-time placement</SelectItem>
                                    <SelectItem value="weekly">Weekly (recurring)</SelectItem>
                                    <SelectItem value="monthly">Monthly (recurring)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Date Selection */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    {itemScheduling.frequency === 'once' ? 'Publication Date' : 'Start Date'}
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {itemScheduling.startDate ? format(itemScheduling.startDate, 'PPP') : 'Select date'}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <CalendarComponent
                                        mode="single"
                                        selected={itemScheduling.startDate}
                                        onSelect={(date) => updateScheduling(item.id, { startDate: date })}
                                        disabled={(date) => date < addDays(new Date(), itemScheduling.timing === 'rush' ? 1 : 5)}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>

                                {itemScheduling.frequency !== 'once' && (
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">End Date (optional)</Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                          <Calendar className="mr-2 h-4 w-4" />
                                          {itemScheduling.endDate ? format(itemScheduling.endDate, 'PPP') : 'Ongoing'}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                          mode="single"
                                          selected={itemScheduling.endDate}
                                          onSelect={(date) => updateScheduling(item.id, { endDate: date })}
                                          disabled={(date) => date < (itemScheduling.startDate || new Date())}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            {itemScheduling.timing === 'rush' && (
                              <span className="text-xs text-orange-600 block">Includes rush fee</span>
                            )}
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(itemPrice)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => {
                    const placementType = (item as { placement_type?: string }).placement_type
const itemScheduling = getItemScheduling(item)
                    const itemPrice = getItemPrice(item)
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[150px]">
                          {item.publications?.name}
                          {placementType && ` (${placementType === 'sponsored' ? 'S' : 'E'})`}
                          {itemScheduling.timing === 'rush' && ' +Rush'}
                        </span>
                        <span>{formatCurrency(itemPrice)}</span>
                      </div>
                    )
                  })}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full gap-2" size="lg" asChild>
                  <Link href="/checkout">
                    <CreditCard className="h-5 w-5" />
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/publications">
                    Continue Shopping
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
