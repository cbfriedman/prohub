'use client'

import { useState } from 'react'
import { Shield, ShieldOff, Lock } from 'lucide-react'
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
  const { toast } = useToast()

  const handleLogin = () => {
    if (login(password)) {
      setShowDialog(false)
      setPassword('')
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
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
