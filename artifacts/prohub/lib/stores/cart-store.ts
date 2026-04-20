'use client'

import { create } from 'zustand'

export interface CartDisplayItem {
  id: string
  publicationName: string
  tierName: string
  price: number
}

interface CartState {
  items: CartDisplayItem[]
  isOpen: boolean
  setItems: (items: CartDisplayItem[]) => void
  addItem: (item: CartDisplayItem) => void
  removeItem: (id: string) => void
  clearItems: () => void
  setIsOpen: (isOpen: boolean) => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearItems: () => set({ items: [] }),
  setIsOpen: (isOpen) => set({ isOpen }),
}))
