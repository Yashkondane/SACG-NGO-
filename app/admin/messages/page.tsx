'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, RefreshCw } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const { data } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })
            setMessages(data || [])
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return
        try {
            await supabase.from('contacts').delete().eq('id', id)
            fetchMessages()
        } catch (error) {
            console.error('Error deleting message:', error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">View and manage contact form submissions.</p>
                </div>
                <Button variant="outline" onClick={fetchMessages}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Form Submissions</CardTitle>
                    <CardDescription>Recent messages sent by users via the contact form.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No messages received yet.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((msg) => (
                                    <TableRow key={msg.id}>
                                        <TableCell className="whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{msg.full_name}</TableCell>
                                        <TableCell>{msg.email}</TableCell>
                                        <TableCell>{msg.subject || 'N/A'}</TableCell>
                                        <TableCell className="max-w-md truncate" title={msg.message}>{msg.message}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(msg.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
