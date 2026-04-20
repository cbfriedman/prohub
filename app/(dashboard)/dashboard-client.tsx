'use client'

import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/lib/stores/cart-store'

export function DashboardClient() {
  const { items } = useCartStore()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Cart Items
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{items.length}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Placements pending checkout
        </p>
      </CardContent>
    </Card>
  )
}
