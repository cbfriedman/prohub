'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { startCheckoutSession, handleCheckoutComplete } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initCheckout() {
      try {
        const secret = await startCheckoutSession()
        setClientSecret(secret)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize checkout')
      } finally {
        setIsLoading(false)
      }
    }
    initCheckout()
  }, [])

  const handleComplete = useCallback(async () => {
    setIsComplete(true)
    // The webhook will handle the order creation
    // But we can also verify client-side
    setTimeout(() => {
      router.push('/orders')
    }, 3000)
  }, [router])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Preparing checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <Link href="/publications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Publications
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Checkout Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/publications">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground text-center mb-6">
              Thank you for your order. You will be redirected to your orders page shortly.
            </p>
            <Link href="/orders">
              <Button>View Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Unable to Load Checkout</CardTitle>
            <CardDescription>Please try again later.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/publications">
              <Button>Back to Publications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <Link href="/publications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Publications
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Checkout</h1>
      
      <div className="max-w-3xl">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ 
            clientSecret,
            onComplete: handleComplete
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  )
}
