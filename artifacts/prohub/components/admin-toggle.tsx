'use client'

import { useState } from 'react'
import { Shield, ShieldOff, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminStore } from '@/lib/stores/admin-store'
import { useToast } from '@/hooks/use-toast'

export function AdminToggle() {
  const { isAdmin, login, logout } = useAdminStore()
  const [showDialog, setShowDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleLogin = () => {
    if (login(password)) {
      setShowDialog(false)
      setPassword('')
      setShowPassword(false)
      toast({
        title: 'Admin Access Granted',
        description: 'You can now view internal pricing details.',
      })
    } else {
      toast({
        title: 'Access Denied',
        description: 'Incorrect password.',
        variant: 'destructive',
      })
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: 'Logged Out',
      description: 'Admin access has been revoked.',
    })
  }

  if (isAdmin) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="border-amber-500 text-amber-600 hover:bg-amber-50"
      >
        <ShieldOff className="h-4 w-4 mr-2" />
        Exit Admin
      </Button>
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="text-muted-foreground"
      >
        <Shield className="h-4 w-4 mr-2" />
        Admin Access
      </Button>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) { setPassword(''); setShowPassword(false) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Access
            </DialogTitle>
            <DialogDescription>
              Enter the admin password to view internal pricing and commission details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full">
              Access Admin Mode
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
