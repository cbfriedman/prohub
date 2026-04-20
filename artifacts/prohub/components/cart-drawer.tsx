'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { ShoppingCart, X, Trash2, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCartStore } from '@/lib/stores/cart-store'
import { useAdminStore } from '@/lib/stores/admin-store'
import { getCartItems, removeFromCart, clearCart } from '@/app/actions/cart'
import { formatCurrency, MARKUP_PERCENTAGE } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'

export function CartDrawer() {
  const { items, setItems, isOpen, setIsOpen } = useCartStore()
  const { isAdmin: isAdminRaw } = useAdminStore()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const isAdmin = mounted && isAdminRaw

  // Helper to format placement type
  const formatPlacementType = (type: string | null | undefined) => {
    if (type === 'sponsored') return 'Sponsored Article'
    if (type === 'editorial') return 'Editorial Mention'
    return 'Unknown'
  }

  // Load cart on mount and set mounted flag
  useEffect(() => {
    setMounted(true)
    startTransition(async () => {
      const cartItems = await getCartItems()
      setItems(cartItems.map(item => ({
        id: item.id,
        publicationName: item.publications?.name || 'Unknown',
        tierName: formatPlacementType(item.placement_type),
        price: Number(item.price),
      })))
    })
  }, [setItems])

  const handleRemoveItem = (id: string) => {
    startTransition(async () => {
      const result = await removeFromCart(id)
      if (result.success) {
        const cartItems = await getCartItems()
        setItems(cartItems.map(item => ({
          id: item.id,
          publicationName: item.publications?.name || 'Unknown',
          tierName: formatPlacementType(item.placement_type),
          price: Number(item.price),
        })))
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to remove item',
          variant: 'destructive',
        })
      }
    })
  }

  const handleClearCart = () => {
    startTransition(async () => {
      const result = await clearCart()
      if (result.success) {
        setItems([])
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to clear cart',
          variant: 'destructive',
        })
      }
    })
  }

  const cartTotal = items.reduce((sum, item) => sum + item.price, 0)
  const publisherTotal = cartTotal / (1 + MARKUP_PERCENTAGE)
  const commission = cartTotal - publisherTotal

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Ad Cart
            {items.length > 0 && (
              <Badge className="bg-green-600 text-white">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add placements from publications to get started
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.publicationName}</p>
                      <p className="text-sm text-muted-foreground">{item.tierName}</p>
                      <div className="mt-1">
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t pt-4 mt-4 space-y-3">
                {isAdmin && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Publisher Total</span>
                      <span>{formatCurrency(publisherTotal)}</span>
                    </div>
                    <div className="flex justify-between text-amber-600">
                      <span>Agency Commission ({Math.round(MARKUP_PERCENTAGE * 100)}%)</span>
                      <span>+{formatCurrency(commission)}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span className="text-green-600">{formatCurrency(cartTotal)}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline"
                    className="w-full"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/cart" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Full Cart
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleClearCart}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Clear
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      onClick={() => {
                        setIsOpen(false)
                        window.location.href = '/checkout'
                      }}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
