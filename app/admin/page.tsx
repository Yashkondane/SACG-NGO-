'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, X, Trash2, RefreshCw, Plus, Calendar as CalendarIcon, Upload, Pencil } from 'lucide-react'
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
import { GalleryManager } from '@/components/admin/gallery-manager'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('events')
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [sponsors, setSponsors] = useState<any[]>([])

    // Upload Context State
    const [uploadContext, setUploadContext] = useState<'event' | 'sponsor'>('event')

    // Event Form State
    const [newEventOpen, setNewEventOpen] = useState(false)
    const [editEventOpen, setEditEventOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        location: '',
        excerpt: '',
        content: '',
        category: 'general',
        image_url: ''
    })

    // Sponsor Form State
    const [newSponsorOpen, setNewSponsorOpen] = useState(false)
    const [newSponsor, setNewSponsor] = useState({
        name: '',
        website_url: '',
        logo_url: ''
    })

    const router = useRouter()

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch Messages
            const { data: msgs } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })

            // Fetch Events
            const { data: evts } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false })

            // Fetch Sponsors
            const { data: spons } = await supabase
                .from('sponsors')
                .select('*')
                .order('display_order', { ascending: true })

            setMessages(msgs || [])
            setEvents(evts || [])
            setSponsors(spons || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])



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
            // Determine bucket and path based on context
            const bucketName = uploadContext === 'event' ? 'event-images' : 'sponsor-logos'
            const filePath = `${fileName}`

            // Convert Blob to File
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file)

            if (uploadError) {
                if (uploadError.message.includes("Bucket not found")) {
                    throw new Error(`Bucket '${bucketName}' not found. Please create it in Supabase Storage.`)
                }
                throw uploadError
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            if (uploadContext === 'event') {
                // Check if we're editing or creating
                if (editingEvent) {
                    setEditingEvent({ ...editingEvent, image_url: publicUrl })
                } else {
                    setNewEvent({ ...newEvent, image_url: publicUrl })
                }
            } else {
                setNewSponsor({ ...newSponsor, logo_url: publicUrl })
            }
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
            // Convert input string to Eastern Time ISO
            // We treat the input e.g., "2024-10-10T11:00" as 11:00 AM ET.

            const rawDate = new Date(newEvent.date);
            // Get the specific date strings
            const targetTimeStr = newEvent.date; // YYYY-MM-DDTHH:mm

            // Heuristic to determine offset (Standard -5 vs Daylight -4)
            // We create a date object and check if it falls in DST for NY.
            // Since JS Date doesn't support "set timezone", we use string manipulation.

            // 1. Create a UTC date from the string
            const utcDate = new Date(targetTimeStr + 'Z');

            // 2. Format this UTC date to NY time to see the "shift"
            const nyString = utcDate.toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false });
            // This tells us what time it IS in NY if the input was UTC.

            // This is getting complicated. Simpler approach:
            // Append the offset manually.

            // Check if date is in DST (Approximate for North America: March to Nov)
            const month = rawDate.getMonth() + 1; // 1-12
            // Simplistic DST check: March to November. 
            // Better: Let's assume the user enters local time and we shift it.
            // BUT user is likely remote.

            // ROBUST SOLUTION:
            // Construct a string with explicit offset.
            // We'll use a library-less way to find offset for the date.

            const getOffset = (d: Date) => {
                // Returns '-04:00' or '-05:00' for NY
                const str = d.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' });
                const extract = str.match(/GMT([+-]\d{2}:\d{2})/);
                return extract ? extract[1] : '-05:00'; // Fallback to EST
            };

            const offset = getOffset(new Date(newEvent.date));
            const finalIso = `${newEvent.date}:00${offset}`;

            // Now we have "2024-10-10T11:00:00-04:00" for example.

            const { error } = await supabase
                .from('events')
                .insert([{ ...newEvent, date: finalIso }])

            if (error) throw error

            alert('Event created successfully!')
            setNewEventOpen(false)
            setNewEvent({ title: '', date: '', location: '', excerpt: '', content: '', category: 'general', image_url: '' })
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

    const handleEditEvent = (event: any) => {
        // Convert the stored ISO date to datetime-local format
        const date = new Date(event.date)
        const localDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16)

        setEditingEvent({
            ...event,
            date: localDateTime
        })
        setEditEventOpen(true)
    }

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingEvent) return

        try {
            // Convert input string to Eastern Time ISO (same logic as create)
            const getOffset = (d: Date) => {
                const str = d.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' });
                const extract = str.match(/GMT([+-]\d{2}:\d{2})/);
                return extract ? extract[1] : '-05:00';
            };

            const offset = getOffset(new Date(editingEvent.date));
            const finalIso = `${editingEvent.date}:00${offset}`;

            const { error } = await supabase
                .from('events')
                .update({
                    title: editingEvent.title,
                    date: finalIso,
                    location: editingEvent.location,
                    excerpt: editingEvent.excerpt,
                    content: editingEvent.content,
                    category: editingEvent.category,
                    image_url: editingEvent.image_url
                })
                .eq('id', editingEvent.id)

            if (error) throw error

            alert('Event updated successfully!')
            setEditEventOpen(false)
            setEditingEvent(null)
            fetchData()
        } catch (error: any) {
            console.error('Error updating event:', error)
            alert(`Failed to update event: ${error.message}`)
        }
    }


    const handleCreateSponsor = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('sponsors')
                .insert([newSponsor])

            if (error) throw error

            alert('Sponsor added successfully!')
            setNewSponsorOpen(false)
            setNewSponsor({ name: '', website_url: '', logo_url: '' })
            fetchData()
        } catch (error: any) {
            console.error('Error adding sponsor:', error)
            alert(`Failed to add sponsor: ${error.message}`)
        }
    }

    const handleDeleteSponsor = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sponsor?')) return
        try {
            await supabase.from('sponsors').delete().eq('id', id)
            fetchData()
        } catch (error) {
            console.error('Error deleting sponsor:', error)
        }
    }

    const initiateSponsorUpload = () => {
        setUploadContext('sponsor')
        fileInputRef.current?.click()
    }

    const initiateEventUpload = () => {
        setUploadContext('event')
        fileInputRef.current?.click()
    }


    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={selectedImageSrc}
                onCropComplete={handleCropComplete}
                aspect={uploadContext === 'event' ? 16 / 9 : 1}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage events, sponsors, and view messages</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={fetchData}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                    <Button variant="secondary" onClick={handleLogout}>Sign Out</Button>
                </div>
            </div>

            {/* Hidden File Input for Image Uploads - Moved outside TabsContent to ensure availability */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
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
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <select
                                                id="category"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={newEvent.category}
                                                onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                                            >
                                                <option value="general">General</option>
                                                <option value="health">Health Awareness</option>
                                            </select>
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
                                                <Button type="button" variant="outline" onClick={initiateEventUpload} disabled={uploading}>
                                                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                    {uploading ? 'Processing...' : 'Select & Crop Image'}
                                                </Button>
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
                                        <p className="text-xs text-muted-foreground text-center mt-2">
                                            Note: You can add Gallery images in the event list after creating the event.
                                        </p>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {/* Edit Event Dialog */}
                            <Dialog open={editEventOpen} onOpenChange={setEditEventOpen}>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Event</DialogTitle>
                                        <DialogDescription>Update the event details.</DialogDescription>
                                    </DialogHeader>
                                    {editingEvent && (
                                        <form onSubmit={handleUpdateEvent} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-title">Event Title *</Label>
                                                <Input
                                                    id="edit-title"
                                                    required
                                                    value={editingEvent.title}
                                                    onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-category">Category</Label>
                                                <select
                                                    id="edit-category"
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={editingEvent.category}
                                                    onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value })}
                                                >
                                                    <option value="general">General</option>
                                                    <option value="health">Health Awareness</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-date">Date & Time *</Label>
                                                    <Input
                                                        id="edit-date"
                                                        type="datetime-local"
                                                        required
                                                        value={editingEvent.date}
                                                        onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-location">Location *</Label>
                                                    <Input
                                                        id="edit-location"
                                                        required
                                                        value={editingEvent.location}
                                                        onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="edit-image">Event Image</Label>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setUploadContext('event')
                                                            initiateEventUpload()
                                                        }}
                                                        disabled={uploading}
                                                    >
                                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                        {uploading ? 'Processing...' : 'Change Image'}
                                                    </Button>
                                                    {editingEvent.image_url && <span className="text-sm text-green-600">Image set!</span>}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="edit-excerpt">Short Description (Excerpt) *</Label>
                                                <Textarea
                                                    id="edit-excerpt"
                                                    required
                                                    placeholder="Brief summary for the event card..."
                                                    value={editingEvent.excerpt}
                                                    onChange={e => setEditingEvent({ ...editingEvent, excerpt: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-content">Full Details *</Label>
                                                <Textarea
                                                    id="edit-content"
                                                    required
                                                    placeholder="Full event details..."
                                                    className="h-32"
                                                    value={editingEvent.content}
                                                    onChange={e => setEditingEvent({ ...editingEvent, content: e.target.value })}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full" disabled={uploading}>Update Event</Button>
                                        </form>
                                    )}
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
                                                <TableCell>{new Date(event.date).toLocaleDateString('en-US', { timeZone: 'America/New_York' })}</TableCell>
                                                <TableCell>{event.location}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditEvent(event)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <GalleryManager eventId={event.id} eventTitle={event.title} />
                                                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteEvent(event.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sponsors">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Sponsors Management</CardTitle>
                                <CardDescription>Manage ecosystem sponsors and logos.</CardDescription>
                            </div>
                            <Dialog open={newSponsorOpen} onOpenChange={setNewSponsorOpen}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="mr-2 h-4 w-4" /> Add Sponsor</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add New Sponsor</DialogTitle>
                                        <DialogDescription>1:1 aspect ratio required for logos (optional).</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateSponsor} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sponsor-name">Sponsor Name *</Label>
                                            <Input id="sponsor-name" required value={newSponsor.name} onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sponsor-url">Website URL</Label>
                                            <Input id="sponsor-url" placeholder="https://..." value={newSponsor.website_url} onChange={e => setNewSponsor({ ...newSponsor, website_url: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sponsor-logo">Logo (Optional, 1:1 Ratio)</Label>
                                            <div className="flex items-center gap-4">
                                                <Button type="button" variant="outline" onClick={initiateSponsorUpload} disabled={uploading}>
                                                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                    {uploading ? 'Processing...' : 'Select & Crop Logo'}
                                                </Button>
                                                {/* Hidden input shared by both uploaders, handled by ref */}
                                                {newSponsor.logo_url && <span className="text-sm text-green-600">Logo uploaded!</span>}
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full" disabled={uploading}>Add Sponsor</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {sponsors.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No sponsors added yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Logo</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Website</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sponsors.map((sponsor) => (
                                            <TableRow key={sponsor.id}>
                                                <TableCell>
                                                    <img src={sponsor.logo_url} alt={sponsor.name} className="h-10 w-10 object-contain rounded" />
                                                </TableCell>
                                                <TableCell className="font-medium">{sponsor.name}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{sponsor.website_url}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteSponsor(sponsor.id)}>
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
