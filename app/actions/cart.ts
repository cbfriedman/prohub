'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { addToCartSchema, type AddToCartInput } from '@/lib/validations/schemas'

export interface CartItemWithDetails {
  id: string
  user_id: string
  publication_id: string
  tier_id: string | null
  placement_type: 'sponsored' | 'editorial' | null
  price: number
  timing: 'standard' | 'rush' | null
  frequency: 'once' | 'weekly' | 'monthly' | null
  preferred_date: string | null
  end_date: string | null
  created_at: string | null
  publications: {
    id: string
    name: string
    description: string | null
  }
  publication_tiers: {
    id: string
    name: string
    description: string | null
  } | null
}

export async function getCartItems(): Promise<CartItemWithDetails[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      publications (id, name, description),
      publication_tiers (id, name, description)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching cart items:', error)
    return []
  }
  
  return data as CartItemWithDetails[]
}

export async function getCartCount(): Promise<number> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return 0
  }
  
  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error fetching cart count:', error)
    return 0
  }
  
  return count || 0
}

export async function addToCart(input: AddToCartInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Please log in to add items to cart' }
  }
  
  // Validate input
  const validatedData = addToCartSchema.safeParse(input)
  if (!validatedData.success) {
    return { success: false, error: validatedData.error.errors[0].message }
  }
  
  const { error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: user.id,
      publication_id: validatedData.data.publication_id,
      tier_id: validatedData.data.tier_id || null,
      price: validatedData.data.price,
    }, {
      onConflict: 'user_id,publication_id,tier_id',
    })
  
  if (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
  
  revalidatePath('/publications')
  return { success: true }
}

export async function removeFromCart(itemId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: 'Failed to remove item from cart' }
  }
  
  revalidatePath('/publications')
  return { success: true }
}

export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
  
  revalidatePath('/publications')
  return { success: true }
}

export interface BulkCartItem {
  publication_id: string
  publication_name: string
  type: 'sponsored' | 'editorial'
  price: number
}

export async function addBulkToCart(items: BulkCartItem[]): Promise<{ success: boolean; error?: string; addedCount?: number }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Please log in to add items to cart' }
  }
  
  if (items.length === 0) {
    return { success: false, error: 'No items to add' }
  }
  
  // Transform items for database insertion
  const cartItems = items.map(item => ({
    user_id: user.id,
    publication_id: item.publication_id,
    placement_type: item.type, // 'sponsored' or 'editorial'
    price: item.price,
  }))
  
  const { error } = await supabase
    .from('cart_items')
    .upsert(cartItems, {
      onConflict: 'user_id,publication_id,placement_type',
    })
  
  if (error) {
    console.error('Error adding items to cart:', error)
    return { success: false, error: 'Failed to add items to cart' }
  }
  
  revalidatePath('/publications')
  revalidatePath('/cart')
  return { success: true, addedCount: items.length }
}

export async function updateCartItemType(
  itemId: string, 
  newType: 'sponsored' | 'editorial',
  newPrice: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const { error } = await supabase
    .from('cart_items')
    .update({ 
      placement_type: newType,
      price: newPrice
    })
    .eq('id', itemId)
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error updating cart item:', error)
    return { success: false, error: 'Failed to update item' }
  }
  
  revalidatePath('/cart')
  revalidatePath('/publications')
  return { success: true }
}

export interface SchedulingUpdate {
  timing?: 'standard' | 'rush'
  frequency?: 'once' | 'weekly' | 'monthly'
  preferredDate?: string | null
  endDate?: string | null
}

export async function updateCartItemScheduling(
  itemId: string, 
  scheduling: SchedulingUpdate
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const updateData: Record<string, unknown> = {}
  if (scheduling.timing !== undefined) updateData.timing = scheduling.timing
  if (scheduling.frequency !== undefined) updateData.frequency = scheduling.frequency
  if (scheduling.preferredDate !== undefined) updateData.preferred_date = scheduling.preferredDate
  if (scheduling.endDate !== undefined) updateData.end_date = scheduling.endDate
  
  const { error } = await supabase
    .from('cart_items')
    .update(updateData)
    .eq('id', itemId)
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error updating cart item scheduling:', error)
    return { success: false, error: 'Failed to update scheduling' }
  }
  
  revalidatePath('/cart')
  return { success: true }
}

export async function getCartTotal(): Promise<number> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return 0
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .select('price')
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error fetching cart total:', error)
    return 0
  }
  
  return data.reduce((sum, item) => sum + Number(item.price), 0)
}
