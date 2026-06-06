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
import { Loader2, Plus, Trash2, Pencil, RefreshCw, Upload } from 'lucide-react'
import { SectionEditor } from '@/components/admin/section-editor'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

export default function BoardMembersPage() {
    const [boardMembers, setBoardMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form State
    const [newBoardMemberOpen, setNewBoardMemberOpen] = useState(false)
    const [editBoardMemberOpen, setEditBoardMemberOpen] = useState(false)
    const [editingBoardMember, setEditingBoardMember] = useState<any>(null)
    const [newBoardMember, setNewBoardMember] = useState({
        name: '',
        description: '',
        image_url: '',
        display_order: 0
    })

    // Content Editor State
    const pageSlug = 'about'
    const sectionKey = 'members_intro' // Section for introducing board members
    const [pageContent, setPageContent] = useState<any>(null)
    const [contentLoading, setContentLoading] = useState(false)

    // Cropper
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

    const fetchBoardMembers = async () => {
        setLoading(true)
        try {
            const { data } = await supabase
                .from('board_members')
                .select('*')
                .order('display_order', { ascending: true })
            setBoardMembers(data || [])
        } catch (error) {
            console.error('Error fetching board members:', error)
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
        fetchBoardMembers()
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
            const bucketName = 'board-member-images'
            const filePath = `${fileName}`
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            if (editingBoardMember) {
                setEditingBoardMember({ ...editingBoardMember, image_url: publicUrl })
            } else {
                setNewBoardMember({ ...newBoardMember, image_url: publicUrl })
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

    const handleCreateBoardMember = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('board_members')
                .insert([newBoardMember])

            if (error) throw error

            alert('Board member added successfully!')
            setNewBoardMemberOpen(false)
            setNewBoardMember({ name: '', description: '', image_url: '', display_order: 0 })
            fetchBoardMembers()
        } catch (error: any) {
            console.error('Error adding board member:', error)
            alert(`Failed to add board member: ${error.message}`)
        }
    }

    const handleDeleteBoardMember = async (id: string) => {
        if (!confirm('Are you sure you want to delete this board member?')) return
        try {
            await supabase.from('board_members').delete().eq('id', id)
            fetchBoardMembers()
        } catch (error) {
            console.error('Error deleting board member:', error)
        }
    }

    const handleEditBoardMember = (member: any) => {
        setEditingBoardMember(member)
        setEditBoardMemberOpen(true)
    }

    const handleUpdateBoardMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingBoardMember) return
        try {
            const { error } = await supabase
                .from('board_members')
                .update({
                    name: editingBoardMember.name,
                    description: editingBoardMember.description,
                    display_order: editingBoardMember.display_order,
                    image_url: editingBoardMember.image_url
                })
                .eq('id', editingBoardMember.id)

            if (error) throw error

            alert('Board member updated successfully!')
            setEditBoardMemberOpen(false)
            setEditingBoardMember(null)
            fetchBoardMembers()
        } catch (error: any) {
            console.error('Error updating board member:', error)
            alert(`Failed to update board member: ${error.message}`)
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
                    <h1 className="text-3xl font-bold tracking-tight">Board Members</h1>
                    <p className="text-muted-foreground">Manage board member profiles.</p>
                </div>
            </div>

            <Tabs defaultValue="list">
                <TabsList className="mb-4">
                    <TabsTrigger value="list">Manage Members</TabsTrigger>
                    <TabsTrigger value="content">Edit Page Content</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Board Members</CardTitle>
                                <CardDescription>Manage board member profiles and descriptions.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={fetchBoardMembers}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                                <Dialog open={newBoardMemberOpen} onOpenChange={setNewBoardMemberOpen}>
                                    <DialogTrigger asChild>
                                        <Button><Plus className="mr-2 h-4 w-4" /> Add Board Member</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Add New Board Member</DialogTitle>
                                            <DialogDescription>1:1 aspect ratio recommended for profile images.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateBoardMember} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Name *</Label>
                                                <Input required value={newBoardMember.name} onChange={e => setNewBoardMember({ ...newBoardMember, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea value={newBoardMember.description} onChange={e => setNewBoardMember({ ...newBoardMember, description: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Display Order</Label>
                                                <Input type="number" value={newBoardMember.display_order} onChange={e => setNewBoardMember({ ...newBoardMember, display_order: parseInt(e.target.value) || 0 })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Profile Image</Label>
                                                <div className="flex items-center gap-4">
                                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                        Select Image
                                                    </Button>
                                                    {newBoardMember.image_url && <span className="text-sm text-green-600">Image uploaded!</span>}
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full" disabled={uploading}>Add Board Member</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                            ) : boardMembers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No board members added yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Order</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {boardMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    {member.image_url ? (
                                                        <img src={member.image_url} alt={member.name} className="h-10 w-10 object-cover rounded-full" />
                                                    ) : (
                                                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-[10px] text-muted-foreground text-center leading-tight p-1">No Image</div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell>{member.display_order}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="text-blue-500" onClick={() => handleEditBoardMember(member)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDeleteBoardMember(member.id)}>
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

                    <Dialog open={editBoardMemberOpen} onOpenChange={setEditBoardMemberOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Board Member</DialogTitle>
                            </DialogHeader>
                            {editingBoardMember && (
                                <form onSubmit={handleUpdateBoardMember} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name *</Label>
                                        <Input required value={editingBoardMember.name} onChange={e => setEditingBoardMember({ ...editingBoardMember, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea value={editingBoardMember.description || ''} onChange={e => setEditingBoardMember({ ...editingBoardMember, description: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Display Order</Label>
                                        <Input type="number" value={editingBoardMember.display_order || 0} onChange={e => setEditingBoardMember({ ...editingBoardMember, display_order: parseInt(e.target.value) || 0 })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Profile Image</Label>
                                        <div className="flex items-center gap-4">
                                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                Change Image
                                            </Button>
                                            {editingBoardMember.image_url && <span className="text-sm text-green-600">Image set!</span>}
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={uploading}>Update Board Member</Button>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="content">
                    <Card>
                        <CardHeader>
                            <CardTitle>Members Section Content</CardTitle>
                            <CardDescription>Edit the static content introducing the board members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {contentLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <SectionEditor
                                    pageSlug={pageSlug}
                                    sectionKey={sectionKey}
                                    initialContent={pageContent}
                                    onSave={fetchPageContent}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
