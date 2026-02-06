'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, X, Trash2, RefreshCw, Plus, Calendar as CalendarIcon, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ImageCropperDialog } from '@/components/image-cropper-dialog'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('requests')
    const [loading, setLoading] = useState(true)
    const [pendingMembers, setPendingMembers] = useState<any[]>([])
    const [allMembers, setAllMembers] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])

    // Event Form State
    const [newEventOpen, setNewEventOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        location: '',
        excerpt: '',
        content: '',
        image_url: ''
    })

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

            // Fetch Events
            const { data: evts } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false }) // Newest events first

            setPendingMembers(pending || [])
            setAllMembers(all || [])
            setMessages(msgs || [])
            setEvents(evts || [])
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

    // --- Event Handlers & Cropping ---

    // State for Cropper
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]

        // Create a URL for the selected file to display in cropper
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            setSelectedImageSrc(reader.result?.toString() || null)
            setCropperOpen(true)
            // Reset input so creating same file triggers change again if needed
            if (fileInputRef.current) fileInputRef.current.value = ''
        })
        reader.readAsDataURL(file)
    }

    const handleCropComplete = async (croppedBlob: Blob) => {
        setUploading(true)
        try {
            const fileName = `${Math.random()}.jpg`
            const filePath = `${fileName}`

            // Convert Blob to File
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })

            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(filePath, file)

            if (uploadError) {
                if (uploadError.message.includes("Bucket not found")) {
                    throw new Error("Bucket 'event-images' not found. Please create it in Supabase Storage.")
                }
                throw uploadError
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('event-images')
                .getPublicUrl(filePath)

            setNewEvent({ ...newEvent, image_url: publicUrl })
            alert('Image uploaded successfully!')
        } catch (error: any) {
            console.error('Error uploading image:', error)
            alert(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
            setCropperOpen(false)
        }
    }

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('events')
                .insert([newEvent])

            if (error) throw error

            alert('Event created successfully!')
            setNewEventOpen(false)
            setNewEvent({ title: '', date: '', location: '', excerpt: '', content: '', image_url: '' })
            fetchData()
        } catch (error: any) {
            console.error('Error creating event:', error)
            alert(`Failed to create event: ${error.message}`)
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return
        try {
            await supabase.from('events').delete().eq('id', id)
            fetchData()
        } catch (error) {
            console.error('Error deleting event:', error)
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
            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={selectedImageSrc}
                onCropComplete={handleCropComplete}
                aspect={16 / 9}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage members, events, and view messages</p>
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
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                {/* --- Events Tab --- */}
                <TabsContent value="events">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Events Management</CardTitle>
                                <CardDescription>Create and manage community events.</CardDescription>
                            </div>
                            <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="mr-2 h-4 w-4" /> Create Event</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create New Event</DialogTitle>
                                        <DialogDescription>Fill in the details for the new event.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Event Title *</Label>
                                            <Input id="title" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="date">Date & Time *</Label>
                                                <Input id="date" type="datetime-local" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location *</Label>
                                                <Input id="location" required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="image">Event Image</Label>
                                            <div className="flex items-center gap-4">
                                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                    {uploading ? 'Processing...' : 'Select & Crop Image'}
                                                </Button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                />
                                                {newEvent.image_url && <span className="text-sm text-green-600">Image uploaded!</span>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="excerpt">Short Description (Excerpt) *</Label>
                                            <Textarea id="excerpt" required placeholder="Brief summary for the event card..." value={newEvent.excerpt} onChange={e => setNewEvent({ ...newEvent, excerpt: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="content">Full Details *</Label>
                                            <Textarea id="content" required placeholder="Full event details..." className="h-32" value={newEvent.content} onChange={e => setNewEvent({ ...newEvent, content: e.target.value })} />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={uploading}>Create Event</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {events.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No events created yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell className="font-medium">{event.title}</TableCell>
                                                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{event.location}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteEvent(event.id)}>
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
                </TabsContent>

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
