'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ADMIN_PASSWORD } from '@/lib/constants'

interface AdminState {
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdmin: true })
          return true
        }
        return false
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'prhub-admin',
    }
  )
)
