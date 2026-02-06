'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, X, Trash2, Mail, RefreshCw } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('requests')
    const [loading, setLoading] = useState(true)
    const [pendingMembers, setPendingMembers] = useState<any[]>([])
    const [allMembers, setAllMembers] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const router = useRouter()

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch Pending Members
            const { data: pending } = await supabase
                .from('members')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            // Fetch All Members
            const { data: all } = await supabase
                .from('members')
                .select('*')
                .order('full_name', { ascending: true })

            // Fetch Messages
            const { data: msgs } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })

            setPendingMembers(pending || [])
            setAllMembers(all || [])
            setMessages(msgs || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleMemberAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
        if (!confirm(`Are you sure you want to ${action} this member?`)) return

        try {
            if (action === 'delete') {
                await supabase.from('members').delete().eq('id', id)
            } else {
                const status = action === 'approve' ? 'approved' : 'rejected'
                await supabase.from('members').update({ status }).eq('id', id)
            }
            fetchData() // Refresh data
        } catch (error) {
            console.error(`Error ${action} member:`, error)
            alert('Action failed')
        }
    }

    const handleMessageDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return
        try {
            await supabase.from('contacts').delete().eq('id', id)
            fetchData()
        } catch (error) {
            console.error('Error deleting message:', error)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (loading && pendingMembers.length === 0 && allMembers.length === 0) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage members and view messages</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                    <Button variant="secondary" onClick={handleLogout}>Sign Out</Button>
                </div>
            </div>

            <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="requests" className="relative">
                        Member Requests
                        {pendingMembers.length > 0 && (
                            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {pendingMembers.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="members">All Members</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="requests">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Applications</CardTitle>
                            <CardDescription>Review and approve new member requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingMembers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No pending requests.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Profession</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-medium">
                                                    <div>{member.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">{member.email}</div>
                                                </TableCell>
                                                <TableCell>{member.phone}</TableCell>
                                                <TableCell>{member.profession}</TableCell>
                                                <TableCell>{member.location}</TableCell>
                                                <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleMemberAction(member.id, 'approve')}>
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleMemberAction(member.id, 'reject')}>
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="members">
                    <Card>
                        <CardHeader>
                            <CardTitle>Member Directory</CardTitle>
                            <CardDescription>Manage all registered members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Profession</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">
                                                <div>{member.full_name}</div>
                                                <div className="text-xs text-muted-foreground">{member.email}</div>
                                            </TableCell>
                                            <TableCell>{member.phone}</TableCell>
                                            <TableCell>
                                                <Badge variant={member.status === 'approved' ? 'default' : member.status === 'rejected' ? 'destructive' : 'secondary'}>
                                                    {member.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{member.profession}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleMemberAction(member.id, 'delete')}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="messages">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Messages</CardTitle>
                            <CardDescription>Messages from the contact form.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {messages.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No messages.</div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-semibold">{msg.subject}</h4>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <span className="font-medium text-foreground">{msg.full_name}</span>
                                                        <span>&bull;</span>
                                                        <span>{msg.email}</span>
                                                        <span>&bull;</span>
                                                        <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleMessageDelete(msg.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
