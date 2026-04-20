'use client'

import { useState, useTransition } from 'react'
import { Check, Info, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { applyMarkup, formatCurrency, MARKUP_PERCENTAGE, FOCUS_COLORS, GEOGRAPHIC_COLORS } from '@/lib/constants'
import { addToCart } from '@/app/actions/cart'
import type { PublicationWithTiers } from '@/app/actions/publications'
import type { Focus, Geographic } from '@/lib/validations/schemas'
import { useToast } from '@/hooks/use-toast'

interface RateCardModalProps {
  publication: PublicationWithTiers
  isAdmin?: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RateCardModal({ publication, isAdmin = false, open, onOpenChange }: RateCardModalProps) {
  const [selectedTiers, setSelectedTiers] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const toggleTier = (tierId: string) => {
    const newSelected = new Set(selectedTiers)
    if (newSelected.has(tierId)) {
      newSelected.delete(tierId)
    } else {
      newSelected.add(tierId)
    }
    setSelectedTiers(newSelected)
  }

  const handleAddToCart = () => {
    startTransition(async () => {
      for (const tierId of selectedTiers) {
        const tier = publication.publication_tiers.find(t => t.id === tierId)
        if (tier) {
          const price = applyMarkup(Number(tier.publisher_rate), true)
          const result = await addToCart({
            publication_id: publication.id,
            tier_id: tierId,
            price,
          })
          
          if (!result.success) {
            toast({
              title: 'Error',
              description: result.error || 'Failed to add to cart',
              variant: 'destructive',
            })
            return
          }
        }
      }
      
      toast({
        title: 'Added to cart',
        description: `${selectedTiers.size} placement(s) added to your cart`,
      })
      
      setSelectedTiers(new Set())
      onOpenChange(false)
    })
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {publication.name}
              {publication.is_free && (
                <Badge className="bg-green-500 text-white">Free</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {publication.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className={FOCUS_COLORS[publication.focus as Focus]}>
                {publication.focus}
              </Badge>
              <Badge className={GEOGRAPHIC_COLORS[publication.geographic as Geographic]}>
                {publication.geographic}
              </Badge>
              {publication.region && (
                <Badge variant="outline">{publication.region}</Badge>
              )}
              {publication.frequency && (
                <Badge variant="outline">{publication.frequency}</Badge>
              )}
            </div>
            
            {publication.audience && (
              <div className="text-sm text-muted-foreground">
                <strong>Audience:</strong> {publication.audience}
              </div>
            )}

            {/* Admin Notice */}
            {isAdmin && !publication.is_free && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <span className="font-medium text-amber-600">Admin View:</span>{' '}
                <span className="text-muted-foreground">
                  Showing publisher rates with {Math.round(MARKUP_PERCENTAGE * 100)}% agency markup
                </span>
              </div>
            )}
            
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Available Placements</h4>
              <div className="space-y-3">
                {publication.publication_tiers.map((tier) => {
                  const publisherRate = Number(tier.publisher_rate)
                  const clientRate = applyMarkup(publisherRate, true)
                  const commission = clientRate - publisherRate
                  const isSelected = selectedTiers.has(tier.id)
                  const isFree = publisherRate === 0
                  
                  return (
                    <div
                      key={tier.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      } ${isFree ? 'cursor-default' : ''}`}
                      onClick={() => !isFree && toggleTier(tier.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{tier.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {tier.description}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {isFree ? (
                          <span className="text-green-600 font-semibold">Free</span>
                        ) : isAdmin ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-right flex items-center gap-2">
                                <div>
                                  <div className="text-xs text-muted-foreground line-through">
                                    {formatCurrency(publisherRate)}
                                  </div>
                                  <div className="text-green-600 font-semibold">
                                    {formatCurrency(clientRate)}
                                  </div>
                                </div>
                                <Info className="h-4 w-4 text-amber-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="p-3">
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-4">
                                  <span>Publisher Rate:</span>
                                  <span>{formatCurrency(publisherRate)}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span>Markup ({MARKUP_PERCENTAGE * 100}%):</span>
                                  <span className="text-amber-500">+{formatCurrency(commission)}</span>
                                </div>
                                <div className="flex justify-between gap-4 font-semibold border-t pt-1">
                                  <span>Client Charge:</span>
                                  <span className="text-green-600">{formatCurrency(clientRate)}</span>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            {formatCurrency(clientRate)}
                          </span>
                        )}
                        
                        {!isFree && (
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {selectedTiers.size > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {selectedTiers.size} placement(s) selected
                    </span>
                    <div className="font-semibold">
                      Total: {formatCurrency(
                        Array.from(selectedTiers).reduce((sum, tierId) => {
                          const tier = publication.publication_tiers.find(t => t.id === tierId)
                          return sum + (tier ? applyMarkup(Number(tier.publisher_rate), true) : 0)
                        }, 0)
                      )}
                    </div>
                  </div>
                  <Button onClick={handleAddToCart} disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
