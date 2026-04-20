'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { getCartItems, clearCart } from './cart'

export async function startCheckoutSession(): Promise<string | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Please log in to checkout')
  }
  
  const cartItems = await getCartItems()
  if (cartItems.length === 0) {
    throw new Error('Your cart is empty')
  }
  
  // Build line items from cart
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.publications.name,
        description: item.publication_tiers?.name || 'Standard placement',
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: 1,
  }))
  
  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    metadata: {
      user_id: user.id,
      cart_item_ids: cartItems.map(i => i.id).join(','),
    },
  })
  
  return session.client_secret
}

export async function handleCheckoutComplete(sessionId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  // Retrieve the session to verify payment
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  
  if (session.payment_status !== 'paid') {
    return { success: false, error: 'Payment not completed' }
  }
  
  // Get cart items to create order
  const cartItems = await getCartItems()
  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price), 0)
  
  // Create order record
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      stripe_session_id: sessionId,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'paid',
      total_amount: totalAmount,
    })
    .select('id')
    .single()
  
  if (orderError) {
    console.error('Error creating order:', orderError)
    return { success: false, error: 'Failed to create order record' }
  }
  
  // Create order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    publication_id: item.publication_id,
    tier_id: item.tier_id,
    price: item.price,
  }))
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError)
  }
  
  // Clear the cart
  await clearCart()
  
  return { success: true }
}

export async function getOrderHistory() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        publications (name),
        publication_tiers (name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data
}
