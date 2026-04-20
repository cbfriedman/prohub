'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  LayoutDashboard, 
  Megaphone, 
  Newspaper, 
  BookOpen, 
  FileText,
  ShoppingCart,
  Plus,
  LogIn,
  LogOut,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdminStore } from '@/lib/stores/admin-store'
import { useCartStore } from '@/lib/stores/cart-store'
import { AdminToggle } from './admin-toggle'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/publications', label: 'Publications', icon: Newspaper },
  { href: '/newsroom', label: 'Newsroom', icon: BookOpen, badge: 'Free' },
]

// Admin-only nav items
const adminNavItems = [
  { href: '/admin/submissions', label: 'Submissions', icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isAdmin } = useAdminStore()
  const { items, setIsOpen } = useCartStore()
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-slate-100">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Megaphone className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">PR Hub</span>
        </Link>
        {isAdmin && (
          <Badge className="ml-auto bg-amber-500 text-white text-xs">
            Admin
          </Badge>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge && (
                <Badge className="ml-auto bg-green-600 text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</p>
            </div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-amber-600/20 text-amber-400'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        {/* Admin Toggle */}
        <AdminToggle />

        {/* Cart Button */}
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          Ad Cart
          {items.length > 0 && (
            <Badge className="ml-auto bg-green-600 text-white">
              {items.length}
            </Badge>
          )}
        </Button>

        {/* Auth Section */}
        {user ? (
          <>
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400">
              <User className="h-4 w-4" />
              <span className="truncate">{user.email}</span>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </Button>
          </Link>
        )}

        {/* New Campaign Button */}
        <Link href="/campaigns/new">
          <Button className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>
    </aside>
  )
}
