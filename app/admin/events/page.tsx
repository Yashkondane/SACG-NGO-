'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ImageCropperDialog } from '@/components/image-cropper-dialog'
import { GalleryManager } from '@/components/admin/gallery-manager'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Loader2, Plus, Trash2, Pencil, RefreshCw, Upload } from 'lucide-react'

export default function EventsAdmin() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form State
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
        image_url: '',
        is_tbd: false
    })

    // Content Editor State
    const [pageContent, setPageContent] = useState<any>(null)
    const [contentLoading, setContentLoading] = useState(false)

    // Cropper
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

    const parseLocation = (locStr: string) => {
        if (!locStr) return { venue: '', address: '', mapUrl: '', eventUrl: '' };
        try {
            const parsed = JSON.parse(locStr);
            if (parsed && typeof parsed === 'object') {
                return {
                    venue: parsed.venue || '',
                    address: parsed.address || '',
                    mapUrl: parsed.mapUrl || '',
                    eventUrl: parsed.eventUrl || ''
                };
            }
        } catch(e) {}
        return { venue: locStr, address: '', mapUrl: '', eventUrl: '' };
    }

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const { data } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false })
            setEvents(data || [])
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            setSelectedImageSrc(reader.result?.toString() || null)
            setCropperOpen(true)
            if (fileInputRef.current) fileInputRef.current.value = ''
        })
        reader.readAsDataURL(file)
    }

    const handleCropComplete = async (croppedBlob: Blob) => {
        setUploading(true)
        try {
            const fileName = `${Math.random()}.jpg`
            const bucketName = 'event-images'
            const filePath = `${fileName}`
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            if (editingEvent) {
                setEditingEvent({ ...editingEvent, image_url: publicUrl })
            } else {
                setNewEvent({ ...newEvent, image_url: publicUrl })
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
            const getOffset = (d: Date) => {
                const str = d.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' });
                const extract = str.match(/GMT([+-]\d{2}:\d{2})/)
                return extract ? extract[1] : '-05:00'
            }

            const offset = getOffset(new Date(newEvent.date))
            const finalIso = `${newEvent.date}:00${offset}`
            const dateToSave = newEvent.is_tbd ? '2099-12-31T23:59:00-05:00' : finalIso

            const { error } = await supabase
                .from('events')
                .insert([{ ...newEvent, date: dateToSave }])

            if (error) throw error

            alert('Event created successfully!')
            setNewEventOpen(false)
            setNewEvent({ title: '', date: '', location: '', excerpt: '', content: '', category: 'general', image_url: '', is_tbd: false })
            fetchEvents()
        } catch (error: any) {
            console.error('Error creating event:', error)
            alert(`Failed to create event: ${error.message}`)
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return
        try {
            await supabase.from('events').delete().eq('id', id)
            fetchEvents()
        } catch (error) {
            console.error('Error deleting event:', error)
        }
    }

    const handleEditEvent = (event: any) => {
        const date = new Date(event.date)
        const localDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16)

        setEditingEvent({ ...event, date: localDateTime })
        setEditEventOpen(true)
    }

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingEvent) return

        try {
            const getOffset = (d: Date) => {
                const str = d.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' });
                const extract = str.match(/GMT([+-]\d{2}:\d{2})/)
                return extract ? extract[1] : '-05:00'
            }

            const offset = getOffset(new Date(editingEvent.date))
            const finalIso = `${editingEvent.date}:00${offset}`
            const dateToSave = editingEvent.is_tbd ? '2099-12-31T23:59:00-05:00' : finalIso

            const { error } = await supabase
                .from('events')
                .update({
                    title: editingEvent.title,
                    date: dateToSave,
                    location: editingEvent.location,
                    excerpt: editingEvent.excerpt,
                    content: editingEvent.content,
                    category: editingEvent.category,
                    image_url: editingEvent.image_url,
                    is_tbd: editingEvent.is_tbd
                })
                .eq('id', editingEvent.id)

            if (error) throw error

            alert('Event updated successfully!')
            setEditEventOpen(false)
            setEditingEvent(null)
            fetchEvents()
        } catch (error: any) {
            console.error('Error updating event:', error)
            alert(`Failed to update event: ${error.message}`)
        }
    }

    return (
        <div className="space-y-4">
            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={selectedImageSrc}
                onCropComplete={handleCropComplete}
                aspect={16 / 9}
            />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                    <p className="text-muted-foreground">Manage your community events.</p>
                </div>
            </div>

            <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Events List</CardTitle>
                                <CardDescription>Create and manage community events.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={fetchEvents}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                                <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
                                    <DialogTrigger asChild>
                                        <Button><Plus className="mr-2 h-4 w-4" /> Create Event</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Create New Event</DialogTitle>
                                            <DialogDescription>Fill in the details for the new event.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
                                            {/* Event Form fields... (Truncated for brevity, but same as original) */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Event Title *</Label>
                                                    <Input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Category</Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                        value={newEvent.category}
                                                        onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                                                    >
                                                        <option value="general">General</option>
                                                        <option value="health">Health Awareness</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Date & Time {newEvent.is_tbd ? '' : '*'}</Label>
                                                        <Input type="datetime-local" required={!newEvent.is_tbd} disabled={newEvent.is_tbd} value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <input type="checkbox" id="is_tbd" className="h-4 w-4" checked={newEvent.is_tbd} onChange={(e) => setNewEvent({ ...newEvent, is_tbd: e.target.checked })} />
                                                        <Label htmlFor="is_tbd">Date is TBD</Label>
                                                    </div>
                                                    <div className="space-y-1.5 pt-4">
                                                        <Label>Custom Event URL (Optional)</Label>
                                                        <p className="text-[10px] text-muted-foreground leading-tight mb-1">If provided, clicking this event will take users to this URL.</p>
                                                        <Input placeholder="e.g. /events/health or https://ticketmaster.com" value={parseLocation(newEvent.location).eventUrl} onChange={e => setNewEvent({ ...newEvent, location: JSON.stringify({ ...parseLocation(newEvent.location), eventUrl: e.target.value }) })} />
                                                    </div>
                                                </div>
                                                <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-dashed">
                                                    <div className="space-y-1.5">
                                                        <Label>Venue Name *</Label>
                                                        <Input required placeholder="e.g. Community Center" value={parseLocation(newEvent.location).venue} onChange={e => setNewEvent({ ...newEvent, location: JSON.stringify({ ...parseLocation(newEvent.location), venue: e.target.value }) })} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Street Address</Label>
                                                        <Input placeholder="e.g. 123 Main St, New Haven, CT" value={parseLocation(newEvent.location).address} onChange={e => setNewEvent({ ...newEvent, location: JSON.stringify({ ...parseLocation(newEvent.location), address: e.target.value }) })} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label>Map Link URL</Label>
                                                        <Input placeholder="https://maps.google.com/..." value={parseLocation(newEvent.location).mapUrl} onChange={e => setNewEvent({ ...newEvent, location: JSON.stringify({ ...parseLocation(newEvent.location), mapUrl: e.target.value }) })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Event Image</Label>
                                                    <div className="flex items-center gap-4">
                                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                            Select & Crop Image
                                                        </Button>
                                                        {newEvent.image_url && <span className="text-sm text-green-600">Image uploaded!</span>}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Short Description</Label>
                                                    <RichTextEditor minimal={true} value={newEvent.excerpt} onChange={val => setNewEvent(prev => ({ ...prev, excerpt: val }))} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Full Details</Label>
                                                <RichTextEditor value={newEvent.content} onChange={val => setNewEvent(prev => ({ ...prev, content: val }))} />
                                            </div>
                                            <Button type="submit" className="w-full" disabled={uploading}>Create Event</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                            ) : events.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No events created yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell className="font-medium">{event.title}</TableCell>
                                                <TableCell>{event.is_tbd ? 'TBD' : new Date(event.date).toLocaleDateString('en-US', { timeZone: 'America/New_York' })}</TableCell>
                                                <TableCell>{parseLocation(event.location).venue}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${new Date(event.date) >= new Date() ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 'bg-muted text-muted-foreground'}`}>
                                                            {new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}
                                                        </span>
                                                        {event.category === 'health' && (
                                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800">
                                                                Health
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="text-blue-500" onClick={() => handleEditEvent(event)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <GalleryManager eventId={event.id} eventTitle={event.title} />
                                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDeleteEvent(event.id)}>
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

                    <Dialog open={editEventOpen} onOpenChange={setEditEventOpen}>
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Event</DialogTitle>
                            </DialogHeader>
                            {editingEvent && (
                                <form onSubmit={handleUpdateEvent} className="space-y-4 py-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Event Title *</Label>
                                            <Input required value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                value={editingEvent.category}
                                                onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value })}
                                            >
                                                <option value="general">General</option>
                                                <option value="health">Health Awareness</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Date & Time {editingEvent.is_tbd ? '' : '*'}</Label>
                                                <Input type="datetime-local" required={!editingEvent.is_tbd} disabled={editingEvent.is_tbd} value={editingEvent.is_tbd ? '' : editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input type="checkbox" id="edit_is_tbd" className="h-4 w-4" checked={editingEvent.is_tbd} onChange={(e) => setEditingEvent({ ...editingEvent, is_tbd: e.target.checked })} />
                                                <Label htmlFor="edit_is_tbd">Date is TBD</Label>
                                            </div>
                                            <div className="space-y-1.5 pt-4">
                                                <Label>Custom Event URL (Optional)</Label>
                                                <p className="text-[10px] text-muted-foreground leading-tight mb-1">If provided, clicking this event will take users to this URL.</p>
                                                <Input placeholder="e.g. /events/health or https://ticketmaster.com" value={parseLocation(editingEvent.location).eventUrl} onChange={e => setEditingEvent({ ...editingEvent, location: JSON.stringify({ ...parseLocation(editingEvent.location), eventUrl: e.target.value }) })} />
                                            </div>
                                        </div>
                                        <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-dashed">
                                            <div className="space-y-1.5">
                                                <Label>Venue Name *</Label>
                                                <Input required placeholder="e.g. Community Center" value={parseLocation(editingEvent.location).venue} onChange={e => setEditingEvent({ ...editingEvent, location: JSON.stringify({ ...parseLocation(editingEvent.location), venue: e.target.value }) })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label>Street Address</Label>
                                                <Input placeholder="e.g. 123 Main St, New Haven, CT" value={parseLocation(editingEvent.location).address} onChange={e => setEditingEvent({ ...editingEvent, location: JSON.stringify({ ...parseLocation(editingEvent.location), address: e.target.value }) })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label>Map Link URL</Label>
                                                <Input placeholder="https://maps.google.com/..." value={parseLocation(editingEvent.location).mapUrl} onChange={e => setEditingEvent({ ...editingEvent, location: JSON.stringify({ ...parseLocation(editingEvent.location), mapUrl: e.target.value }) })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Event Image</Label>
                                            <div className="flex items-center gap-4">
                                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                    Change Image
                                                </Button>
                                                {editingEvent.image_url && <span className="text-sm text-green-600">Image set!</span>}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Short Description</Label>
                                            <RichTextEditor minimal={true} value={editingEvent.excerpt} onChange={val => setEditingEvent((prev: any) => ({ ...prev, excerpt: val }))} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Full Details</Label>
                                        <RichTextEditor value={editingEvent.content} onChange={val => setEditingEvent((prev: any) => ({ ...prev, content: val }))} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={uploading}>Update Event</Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
        </div>
    )
}
