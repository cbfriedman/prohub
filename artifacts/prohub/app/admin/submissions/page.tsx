'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send,
  Mail,
  Copy,
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/constants'

// Mock submissions data for admin
const mockSubmissions = [
  {
    id: '1',
    campaignId: 'camp-1',
    campaignName: 'Digs and Gigs Launch',
    advertiser: 'Digs and Gigs',
    advertiserEmail: 'coby.friedman@gmail.com',
    publication: 'San Francisco Chronicle',
    publicationContact: {
      name: 'Sarah Johnson',
      title: 'Advertising Director',
      email: 'sjohnson@sfchronicle.com',
      phone: '(415) 555-0123',
    },
    placementType: 'sponsored',
    price: 960,
    status: 'pending',
    paymentStatus: 'paid',
    submittedAt: null,
    createdAt: '2026-04-19T10:00:00Z',
    scheduling: {
      timing: 'standard',
      frequency: 'once',
      preferredDate: '2026-05-01',
      endDate: null,
    },
    pressRelease: {
      headline: 'Digs and Gigs: Revolutionizing Home Services',
      content: 'Digs and Gigs, a new platform connecting homeowners with trusted contractors, officially launches today in the San Francisco Bay Area...',
    }
  },
  {
    id: '2',
    campaignId: 'camp-1',
    campaignName: 'Digs and Gigs Launch',
    advertiser: 'Digs and Gigs',
    advertiserEmail: 'coby.friedman@gmail.com',
    publication: 'Freshhawk Journal',
    publicationContact: {
      name: 'Mike Chen',
      title: 'Tech Editor',
      email: 'mchen@freshhawk.com',
      phone: '(408) 555-0456',
    },
    placementType: 'editorial',
    price: 360,
    status: 'submitted',
    paymentStatus: 'paid',
    submittedAt: '2026-04-18T14:30:00Z',
    createdAt: '2026-04-17T09:00:00Z',
    scheduling: {
      timing: 'rush',
      frequency: 'once',
      preferredDate: '2026-04-22',
      endDate: null,
    },
    pressRelease: {
      headline: 'Digs and Gigs: Revolutionizing Home Services',
      content: 'Digs and Gigs, a new platform connecting homeowners with trusted contractors, officially launches today in the San Francisco Bay Area...',
    }
  },
  {
    id: '3',
    campaignId: 'camp-2',
    campaignName: 'Tech Startup PR',
    advertiser: 'Acme Corp',
    advertiserEmail: 'pr@acme.com',
    publication: 'TechCrunch',
    publicationContact: {
      name: 'Emily Davis',
      title: 'Press Relations',
      email: 'press@techcrunch.com',
      phone: '(650) 555-0789',
    },
    placementType: 'sponsored',
    price: 2500,
    status: 'approved',
    paymentStatus: 'paid',
    submittedAt: '2026-04-15T11:00:00Z',
    createdAt: '2026-04-14T08:00:00Z',
    scheduling: {
      timing: 'standard',
      frequency: 'monthly',
      preferredDate: '2026-04-20',
      endDate: '2026-07-20',
    },
    pressRelease: {
      headline: 'Acme Corp Raises $50M Series B',
      content: 'Acme Corp, a leading enterprise software company, today announced the closing of its $50 million Series B funding round...',
    }
  },
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  submitted: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  published: 'bg-purple-100 text-purple-800 border-purple-200',
}

const paymentColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800',
}

export default function AdminSubmissionsPage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(null)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      sub.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.advertiser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.publication.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Group by status for stats
  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  }

  const generateCoverLetter = (submission: typeof mockSubmissions[0]) => {
    const schedulingInfo = `
SCHEDULING REQUIREMENTS:
- Timing: ${submission.scheduling.timing === 'rush' ? 'RUSH (Priority - 1-2 business days)' : 'Standard (5-7 business days)'}
- Frequency: ${submission.scheduling.frequency === 'once' ? 'One-time placement' : submission.scheduling.frequency === 'weekly' ? 'Weekly recurring' : 'Monthly recurring'}
- Preferred Publication Date: ${new Date(submission.scheduling.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}${submission.scheduling.endDate ? `\n- End Date: ${new Date(submission.scheduling.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : ''}`

    return `Dear ${submission.publicationContact.name},

I am writing to submit a ${submission.placementType === 'sponsored' ? 'sponsored article' : 'press release for editorial consideration'} on behalf of our client, ${submission.advertiser}.

---
PRESS RELEASE
---

${submission.pressRelease.headline}

${submission.pressRelease.content}

---
${schedulingInfo}

---
CLIENT CONTACT:
${submission.advertiser}
Email: ${submission.advertiserEmail}

---

Please confirm receipt and let us know the expected publication timeline. If you have any questions or require additional materials, please don't hesitate to reach out.

Best regards,
PR Hub Team
press@prhub.com
(415) 555-PRUB`
  }

  const handleOpenEmailDialog = (submission: typeof mockSubmissions[0]) => {
    setSelectedSubmission(submission)
    setCoverLetter(generateCoverLetter(submission))
    setEmailDialogOpen(true)
  }

  const handleSendSubmission = () => {
    if (!selectedSubmission) return
    
    startTransition(() => {
      // In production, this would send an email
      setSubmissions(prev => prev.map(s => 
        s.id === selectedSubmission.id 
          ? { ...s, status: 'submitted', submittedAt: new Date().toISOString() }
          : s
      ))
      setEmailDialogOpen(false)
      toast({
        title: 'Submission sent',
        description: `Email sent to ${selectedSubmission.publicationEmail}`,
      })
    })
  }

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setSubmissions(prev => prev.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ))
    toast({
      title: 'Status updated',
      description: `Submission status changed to ${newStatus}`,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: 'Copied to clipboard' })
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-amber-500 text-white">Admin</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Submission Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage press release submissions to publications
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="cursor-pointer hover:border-yellow-300 transition-colors" onClick={() => setStatusFilter('pending')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting submission</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setStatusFilter('submitted')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
            <Send className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Sent to publications</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-green-300 transition-colors" onClick={() => setStatusFilter('approved')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Accepted by publications</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-red-300 transition-colors" onClick={() => setStatusFilter('rejected')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns, advertisers, publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
          <CardDescription>
            Review and submit press releases to publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign / Advertiser</TableHead>
                <TableHead>Publication / Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scheduling</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.campaignName}</p>
                      <p className="text-sm text-muted-foreground">{submission.advertiser}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.publication}</p>
                      <p className="text-xs text-muted-foreground">{submission.publicationContact.name}</p>
                      <p className="text-xs text-blue-600">{submission.publicationContact.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={submission.placementType === 'sponsored' ? 'border-blue-300 text-blue-700' : 'border-purple-300 text-purple-700'}>
                      {submission.placementType === 'sponsored' ? 'Sponsored' : 'Editorial'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-medium">{submission.scheduling.timing === 'rush' ? 'Rush' : 'Standard'}</p>
                      <p className="text-muted-foreground capitalize">{submission.scheduling.frequency}</p>
                      <p className="text-muted-foreground">{new Date(submission.scheduling.preferredDate).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(submission.price)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[submission.status as keyof typeof statusColors]}>
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenEmailDialog(submission)}>
                          <Mail className="h-4 w-4 mr-2" />
                          {submission.status === 'pending' ? 'Submit to Publication' : 'Resend Email'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(submission.publicationContact.email)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Press Release
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(submission.id, 'submitted')}>
                          <Send className="h-4 w-4 mr-2" />
                          Mark as Submitted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(submission.id, 'approved')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(submission.id, 'rejected')}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Mark as Rejected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSubmissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit to Publication</DialogTitle>
            <DialogDescription>
              Review and send the press release to {selectedSubmission?.publication}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              {/* Publisher Contact Card */}
              <div className="p-4 bg-slate-50 rounded-lg border">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Publisher Contact</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">{selectedSubmission.publicationContact.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.publicationContact.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.publication}</p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="text-blue-600">{selectedSubmission.publicationContact.email}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      {selectedSubmission.publicationContact.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advertiser Requirements */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <Label className="text-xs text-amber-800 uppercase tracking-wider">Advertiser Requirements</Label>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Timing</p>
                    <p className="font-medium">{selectedSubmission.scheduling.timing === 'rush' ? 'Rush (Priority)' : 'Standard'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency</p>
                    <p className="font-medium capitalize">{selectedSubmission.scheduling.frequency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preferred Date</p>
                    <p className="font-medium">{new Date(selectedSubmission.scheduling.preferredDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">To</Label>
                  <Input 
                    value={selectedSubmission.publicationContact.email}
                    readOnly
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">From</Label>
                  <Input 
                    value="press@prhub.com"
                    readOnly
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Subject</Label>
                <Input 
                  value={`${selectedSubmission.scheduling.timing === 'rush' ? '[RUSH] ' : ''}Press Release: ${selectedSubmission.pressRelease.headline}`}
                  readOnly
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Cover Letter & Press Release</Label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={16}
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-700">
                  This will send an email to {selectedSubmission.publicationContact.name} at {selectedSubmission.publicationContact.email} and update the status to &quot;Submitted&quot;
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendSubmission} disabled={isPending} className="gap-2">
              <Send className="h-4 w-4" />
              Send Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
