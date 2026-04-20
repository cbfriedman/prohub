import { AppSidebar } from '@/components/app-sidebar'
import { CartDrawer } from '@/components/cart-drawer'
import { Toaster } from '@/components/ui/toaster'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <CartDrawer />
      <Toaster />
    </div>
  )
}
