'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const SPONSORS_SECTIONS = [
    { key: 'header', name: 'Header' },
    { key: 'thank_you', name: 'Thank You' },
    { key: 'cta', name: 'CTA' },
]

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form State
    const [newSponsorOpen, setNewSponsorOpen] = useState(false)
    const [editSponsorOpen, setEditSponsorOpen] = useState(false)
    const [editingSponsor, setEditingSponsor] = useState<any>(null)
    const [newSponsor, setNewSponsor] = useState({
        name: '',
        website_url: '',
        logo_url: ''
    })

    // Content Editor State
    const pageSlug = 'sponsors'
    const [sectionKey, setSectionKey] = useState(SPONSORS_SECTIONS[0].key)
    const [pageContent, setPageContent] = useState<any>(null)
    const [contentLoading, setContentLoading] = useState(false)

    // Cropper & Upload
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

    const fetchSponsors = async () => {
        setLoading(true)
        try {
            const { data } = await supabase
                .from('sponsors')
                .select('*')
                .order('created_at', { ascending: true })
            setSponsors(data || [])
        } catch (error) {
            console.error('Error fetching sponsors:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPageContent = async () => {
        setContentLoading(true)
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('content')
                .eq('page_slug', pageSlug)
                .eq('section_key', sectionKey)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching content:', error)
            }

            const defaultContent = DEFAULT_PAGE_CONTENT[pageSlug]?.[sectionKey] || {}
            setPageContent(data?.content && Object.keys(data.content).length > 0 ? data.content : defaultContent)
        } catch (err) {
            console.error(err)
        } finally {
            setContentLoading(false)
        }
    }

    useEffect(() => {
        fetchSponsors()
    }, [])

    useEffect(() => {
        fetchPageContent()
    }, [sectionKey])

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
            const bucketName = 'sponsor-logos'
            const filePath = `${fileName}`
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            if (editingSponsor) {
                setEditingSponsor({ ...editingSponsor, logo_url: publicUrl })
            } else {
                setNewSponsor({ ...newSponsor, logo_url: publicUrl })
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
            fetchSponsors()
        } catch (error: any) {
            console.error('Error adding sponsor:', error)
            alert(`Failed to add sponsor: ${error.message}`)
        }
    }

    const handleDeleteSponsor = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sponsor?')) return
        try {
            await supabase.from('sponsors').delete().eq('id', id)
            fetchSponsors()
        } catch (error) {
            console.error('Error deleting sponsor:', error)
        }
    }

    const handleEditSponsor = (sponsor: any) => {
        setEditingSponsor(sponsor)
        setEditSponsorOpen(true)
    }

    const handleUpdateSponsor = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSponsor) return
        try {
            const { error } = await supabase
                .from('sponsors')
                .update({
                    name: editingSponsor.name,
                    website_url: editingSponsor.website_url,
                    logo_url: editingSponsor.logo_url
                })
                .eq('id', editingSponsor.id)

            if (error) throw error

            alert('Sponsor updated successfully!')
            setEditSponsorOpen(false)
            setEditingSponsor(null)
            fetchSponsors()
        } catch (error: any) {
            console.error('Error updating sponsor:', error)
            alert(`Failed to update sponsor: ${error.message}`)
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
                    <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
                    <p className="text-muted-foreground">Manage your sponsors list and edit the sponsors page.</p>
                </div>
            </div>

            <Tabs defaultValue="list">
                <TabsList className="mb-4">
                    <TabsTrigger value="list">Manage Sponsors</TabsTrigger>
                    <TabsTrigger value="content">Edit Page Content</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Sponsors List</CardTitle>
                                <CardDescription>Manage ecosystem sponsors and logos.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={fetchSponsors}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
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
                                                <Label>Sponsor Name *</Label>
                                                <Input required value={newSponsor.name} onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Website URL</Label>
                                                <Input placeholder="https://..." value={newSponsor.website_url} onChange={e => setNewSponsor({ ...newSponsor, website_url: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Logo (Optional, 1:1 Ratio)</Label>
                                                <div className="flex items-center gap-4">
                                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                        Select & Crop Logo
                                                    </Button>
                                                    {newSponsor.logo_url && <span className="text-sm text-green-600">Logo uploaded!</span>}
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full" disabled={uploading}>Add Sponsor</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                            ) : sponsors.length === 0 ? (
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
                                                    {sponsor.logo_url ? (
                                                        <img src={sponsor.logo_url} alt={sponsor.name} className="h-10 w-10 object-contain rounded" />
                                                    ) : (
                                                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground text-center leading-tight p-1">No Logo</div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{sponsor.name}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{sponsor.website_url}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="text-blue-500" onClick={() => handleEditSponsor(sponsor)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDeleteSponsor(sponsor.id)}>
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

                    <Dialog open={editSponsorOpen} onOpenChange={setEditSponsorOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Sponsor</DialogTitle>
                            </DialogHeader>
                            {editingSponsor && (
                                <form onSubmit={handleUpdateSponsor} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Sponsor Name *</Label>
                                        <Input required value={editingSponsor.name} onChange={e => setEditingSponsor({ ...editingSponsor, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Website URL</Label>
                                        <Input placeholder="https://..." value={editingSponsor.website_url || ''} onChange={e => setEditingSponsor({ ...editingSponsor, website_url: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Logo (Optional, 1:1 Ratio)</Label>
                                        <div className="flex items-center gap-4">
                                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                Change Logo
                                            </Button>
                                            {editingSponsor.logo_url && <span className="text-sm text-green-600">Logo set!</span>}
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={uploading}>Update Sponsor</Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="content">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sponsors Page Content</CardTitle>
                            <CardDescription>Edit the static content on the sponsors page.</CardDescription>
                            <div className="w-full mt-4">
                                <Label className="mb-2 block">Select Section to Edit</Label>
                                <Tabs value={sectionKey} onValueChange={setSectionKey} className="w-full">
                                    <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
                                        {SPONSORS_SECTIONS.map(s => (
                                            <TabsTrigger key={s.key} value={s.key}>{s.name}</TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {contentLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div key={sectionKey}>
                                    <SectionEditor
                                        pageSlug={pageSlug}
                                        sectionKey={sectionKey}
                                        initialContent={pageContent}
                                        onSave={fetchPageContent}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
