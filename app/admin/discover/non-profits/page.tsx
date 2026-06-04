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
import { SectionEditor } from '@/components/admin/section-editor'
import { Loader2, Plus, Trash2, Pencil, RefreshCw, Upload } from 'lucide-react'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

export default function NonProfitsPage() {
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const itemType = 'non-profit'

    // Form State
    const [newItemOpen, setNewItemOpen] = useState(false)
    const [editItemOpen, setEditItemOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        website_url: '',
        logo_url: '',
        type: itemType
    })

    // Content Editor State
    const pageSlug = 'discover-non-profit'
    const [pageContent, setPageContent] = useState<any>(null)
    const [contentLoading, setContentLoading] = useState(false)

    // Cropper
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

    const fetchItems = async () => {
        setLoading(true)
        try {
            const { data } = await supabase
                .from('discover_items')
                .select('*')
                .eq('type', itemType)
                .order('created_at', { ascending: true })
            setItems(data || [])
        } catch (error) {
            console.error('Error fetching non-profits:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPageContent = async () => {
        setContentLoading(true)
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('section_key, content')
                .eq('page_slug', pageSlug)

            if (error) {
                console.error('Error fetching content:', error)
            }

            const formattedContent = data?.reduce((acc: any, curr) => {
                acc[curr.section_key] = curr.content
                return acc
            }, {}) || {}

            const defaultContent = DEFAULT_PAGE_CONTENT[pageSlug] || {}
            
            setPageContent({
                header: formattedContent['header'] || defaultContent['header'] || {},
                thank_you: formattedContent['thank_you'] || defaultContent['thank_you'] || {},
                cta: formattedContent['cta'] || defaultContent['cta'] || {}
            })
        } catch (err) {
            console.error(err)
        } finally {
            setContentLoading(false)
        }
    }

    useEffect(() => {
        fetchItems()
        fetchPageContent()
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
            const bucketName = 'discover-logos'
            const filePath = `${fileName}`
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            if (editingItem) {
                setEditingItem({ ...editingItem, logo_url: publicUrl })
            } else {
                setNewItem({ ...newItem, logo_url: publicUrl })
            }
            alert('Logo uploaded successfully!')
        } catch (error: any) {
            console.error('Error uploading image:', error)
            alert(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
            setCropperOpen(false)
        }
    }

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('discover_items')
                .insert([{ ...newItem, type: itemType }])

            if (error) throw error

            alert('Non-Profit added successfully!')
            setNewItemOpen(false)
            setNewItem({ name: '', description: '', website_url: '', logo_url: '', type: itemType })
            fetchItems()
        } catch (error: any) {
            console.error('Error adding non-profit:', error)
            alert(`Failed to add non-profit: ${error.message}`)
        }
    }

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this non-profit?')) return
        try {
            await supabase.from('discover_items').delete().eq('id', id)
            fetchItems()
        } catch (error) {
            console.error('Error deleting non-profit:', error)
        }
    }

    const handleEditItem = (item: any) => {
        setEditingItem(item)
        setEditItemOpen(true)
    }

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingItem) return
        try {
            const { error } = await supabase
                .from('discover_items')
                .update({
                    name: editingItem.name,
                    description: editingItem.description,
                    website_url: editingItem.website_url,
                    logo_url: editingItem.logo_url
                })
                .eq('id', editingItem.id)

            if (error) throw error

            alert('Non-Profit updated successfully!')
            setEditItemOpen(false)
            setEditingItem(null)
            fetchItems()
        } catch (error: any) {
            console.error('Error updating non-profit:', error)
            alert(`Failed to update non-profit: ${error.message}`)
        }
    }

    return (
        <div className="space-y-4">
            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={selectedImageSrc}
                onCropComplete={handleCropComplete}
                aspect={1}
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
                    <h1 className="text-3xl font-bold tracking-tight">Non-Profits</h1>
                    <p className="text-muted-foreground">Manage your non-profits list and edit the section content.</p>
                </div>
            </div>

            <Tabs defaultValue="list">
                <TabsList className="mb-4">
                    <TabsTrigger value="list">Manage Non-Profits</TabsTrigger>
                    <TabsTrigger value="content">Edit Page Content</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Non-Profits List</CardTitle>
                                <CardDescription>Add or remove non-profits from the discover section.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={fetchItems}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                                <Dialog open={newItemOpen} onOpenChange={setNewItemOpen}>
                                    <DialogTrigger asChild>
                                        <Button><Plus className="mr-2 h-4 w-4" /> Add Non-Profit</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Add New Non-Profit</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateItem} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Name *</Label>
                                                <Input required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description *</Label>
                                                <Textarea required value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Website URL</Label>
                                                <Input placeholder="https://..." value={newItem.website_url} onChange={e => setNewItem({ ...newItem, website_url: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Logo (Optional, 1:1 Ratio)</Label>
                                                <div className="flex items-center gap-4">
                                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                        Select & Crop Logo
                                                    </Button>
                                                    {newItem.logo_url && <span className="text-sm text-green-600">Logo uploaded!</span>}
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full" disabled={uploading}>Add Non-Profit</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                            ) : items.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No non-profits added yet.</div>
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
                                        {items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {item.logo_url ? (
                                                        <img src={item.logo_url} alt={item.name} className="h-10 w-10 object-contain rounded" />
                                                    ) : (
                                                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground text-center leading-tight p-1">No Logo</div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{item.website_url}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="text-blue-500" onClick={() => handleEditItem(item)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDeleteItem(item.id)}>
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

                    <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Non-Profit</DialogTitle>
                            </DialogHeader>
                            {editingItem && (
                                <form onSubmit={handleUpdateItem} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name *</Label>
                                        <Input required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description *</Label>
                                        <Textarea required value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Website URL</Label>
                                        <Input placeholder="https://..." value={editingItem.website_url || ''} onChange={e => setEditingItem({ ...editingItem, website_url: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Logo (Optional, 1:1 Ratio)</Label>
                                        <div className="flex items-center gap-4">
                                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                Change Logo
                                            </Button>
                                            {editingItem.logo_url && <span className="text-sm text-green-600">Logo set!</span>}
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={uploading}>Update Non-Profit</Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="content">
                    <Card>
                        <CardHeader>
                            <CardTitle>Non-Profits Section Content</CardTitle>
                            <CardDescription>Edit the static content on the non-profits discover page.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {contentLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-lg mb-4">Header Section</h3>
                                        <SectionEditor
                                            pageSlug={pageSlug}
                                            sectionKey="header"
                                            initialContent={pageContent?.header || {}}
                                            onSave={fetchPageContent}
                                        />
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-lg mb-4">Thank You Section</h3>
                                        <SectionEditor
                                            pageSlug={pageSlug}
                                            sectionKey="thank_you"
                                            initialContent={pageContent?.thank_you || {}}
                                            onSave={fetchPageContent}
                                        />
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-lg mb-4">Call to Action</h3>
                                        <SectionEditor
                                            pageSlug={pageSlug}
                                            sectionKey="cta"
                                            initialContent={pageContent?.cta || {}}
                                            onSave={fetchPageContent}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
