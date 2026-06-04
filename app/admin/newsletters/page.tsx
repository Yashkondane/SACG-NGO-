'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { SectionEditor } from '@/components/admin/section-editor'
import { Loader2, Plus, Trash2, RefreshCw } from 'lucide-react'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

export default function NewslettersPage() {
    const [newsletters, setNewsletters] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    // Form State
    const [newNewsletterOpen, setNewNewsletterOpen] = useState(false)
    const [newNewsletter, setNewNewsletter] = useState({
        title: '',
        link: ''
    })

    // Content Editor State
    const pageSlug = 'newsletter'
    const sectionKey = 'header'
    const [pageContent, setPageContent] = useState<any>(null)
    const [contentLoading, setContentLoading] = useState(false)

    const fetchNewsletters = async () => {
        setLoading(true)
        try {
            const { data } = await supabase
                .from('newsletters')
                .select('*')
                .order('created_at', { ascending: false })
            setNewsletters(data || [])
        } catch (error) {
            console.error('Error fetching newsletters:', error)
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
        fetchNewsletters()
        fetchPageContent()
    }, [])

    const handleCreateNewsletter = async (e: React.FormEvent) => {
        e.preventDefault()

        const link = newNewsletter.link
        if (!link.includes('drive.google.com') || !link.includes('/view')) {
            alert("This format can't be accepted. We only support Google Drive links ending in /view")
            return
        }

        try {
            const { error } = await supabase
                .from('newsletters')
                .insert([newNewsletter])

            if (error) throw error

            alert('Newsletter published successfully!')
            setNewNewsletterOpen(false)
            setNewNewsletter({ title: '', link: '' })
            fetchNewsletters()
        } catch (error: any) {
            console.error('Error creating newsletter:', error)
            alert(`Failed to publish newsletter: ${error.message}`)
        }
    }

    const handleDeleteNewsletter = async (id: string) => {
        if (!confirm('Are you sure you want to delete this newsletter?')) return
        try {
            await supabase.from('newsletters').delete().eq('id', id)
            fetchNewsletters()
        } catch (error) {
            console.error('Error deleting newsletter:', error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Newsletters</h1>
                    <p className="text-muted-foreground">Manage and publish your community newsletters and edit the page content.</p>
                </div>
            </div>

            <Tabs defaultValue="list">
                <TabsList className="mb-4">
                    <TabsTrigger value="list">Manage Newsletters</TabsTrigger>
                    <TabsTrigger value="content">Edit Page Content</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Newsletter Archive</CardTitle>
                                <CardDescription>Links to your Google Drive newsletter PDFs.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={fetchNewsletters}>
                                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                                </Button>
                                <Dialog open={newNewsletterOpen} onOpenChange={setNewNewsletterOpen}>
                                    <DialogTrigger asChild>
                                        <Button><Plus className="mr-2 h-4 w-4" /> Add Newsletter</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Add New Newsletter</DialogTitle>
                                            <DialogDescription>Link must be a Google Drive link ending in <code>/view</code>.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateNewsletter} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="newsletter-title">Newsletter Title *</Label>
                                                <Input id="newsletter-title" required placeholder="e.g. January 2026 Issue" value={newNewsletter.title} onChange={e => setNewNewsletter({ ...newNewsletter, title: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="newsletter-link">Google Drive Link *</Label>
                                                <Input id="newsletter-link" required placeholder="https://drive.google.com/.../view" value={newNewsletter.link} onChange={e => setNewNewsletter({ ...newNewsletter, link: e.target.value })} />
                                            </div>
                                            <Button type="submit" className="w-full">Publish Newsletter</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                            ) : newsletters.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No newsletters published yet.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Date Published</TableHead>
                                            <TableHead>Link</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {newsletters.map((nl) => (
                                            <TableRow key={nl.id}>
                                                <TableCell className="font-medium">{nl.title}</TableCell>
                                                <TableCell>{new Date(nl.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="max-w-[300px] truncate">
                                                    <a href={nl.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {nl.link}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteNewsletter(nl.id)}>
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

                <TabsContent value="content">
                    <Card>
                        <CardHeader>
                            <CardTitle>Newsletter Page Content</CardTitle>
                            <CardDescription>Edit the static content on the newsletter page.</CardDescription>
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
