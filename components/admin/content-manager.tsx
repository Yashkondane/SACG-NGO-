'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { SectionEditor } from './section-editor'
import { Loader2 } from 'lucide-react'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

const PAGES = [
    {
        slug: 'home',
        name: 'Home Page',
        sections: [
            { key: 'hero', name: 'Hero Section' },
            { key: 'mission', name: 'Our Mission' },
            { key: 'goal', name: 'Our Goal' },
            { key: 'what_we_do', name: 'What We Do' },
            { key: 'testimonials', name: 'What Our Members Say' },
            { key: 'faq', name: 'FAQ' },
            { key: 'join_community', name: 'Join Community Section' },
        ]
    },
    {
        slug: 'about',
        name: 'About Page',
        sections: [
            { key: 'intro', name: 'Introduction' },
            { key: 'story', name: 'Our Story' },
        ]
    },
    {
        slug: 'sponsors',
        name: 'Sponsors Page',
        sections: [
            { key: 'header', name: 'Header Section' },
            { key: 'thank_you', name: 'Thank You Message' },
            { key: 'cta', name: 'Partner With Us CTA' },
        ]
    },
    {
        slug: 'newsletter',
        name: 'Newsletter Page',
        sections: [
            { key: 'header', name: 'Header Section' }
        ]
    }
]

export function ContentManager() {
    const [pageSlug, setPageSlug] = useState('home')
    const [sectionKey, setSectionKey] = useState('hero')
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState<any>(null)

    // Reset section when page changes
    const availableSections = PAGES.find(p => p.slug === pageSlug)?.sections || []

    // Ensure valid section is selected when page changes
    useEffect(() => {
        if (!availableSections.find(s => s.key === sectionKey)) {
            setSectionKey(availableSections[0]?.key || '')
        }
    }, [pageSlug, availableSections, sectionKey]) // Removed sectionKey from dependency to avoid loop, but it's needed for the logic. Actually, if I change pageSlug, sectionKey might be stale. I should listen to pageSlug changes.

    useEffect(() => {
        // When pageSlug changes, default to first section if current key not found
        const sections = PAGES.find(p => p.slug === pageSlug)?.sections || []
        const found = sections.find(s => s.key === sectionKey)
        if (!found && sections.length > 0) {
            setSectionKey(sections[0].key)
        }
    }, [pageSlug])

    useEffect(() => {
        if (!pageSlug || !sectionKey) return
        fetchContent()
    }, [pageSlug, sectionKey])

    const fetchContent = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('content')
                .eq('page_slug', pageSlug)
                .eq('section_key', sectionKey)
                .single()

            if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
                console.error('Error fetching content:', error)
            }

            const defaultContent = DEFAULT_PAGE_CONTENT[pageSlug]?.[sectionKey] || {}
            setContent(data?.content && Object.keys(data.content).length > 0 ? data.content : defaultContent)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Site Content</CardTitle>
                <CardDescription>Select a page and section to edit text and images.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="space-y-2 w-full sm:w-1/3">
                        <Label>Page</Label>
                        <Select value={pageSlug} onValueChange={setPageSlug}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGES.map(p => (
                                    <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 w-full sm:w-1/3">
                        <Label>Section</Label>
                        <Select value={sectionKey} onValueChange={setSectionKey}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSections.map(s => (
                                    <SelectItem key={s.key} value={s.key}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div key={`${pageSlug}-${sectionKey}`}> {/* Force remount on change */}
                        <SectionEditor
                            pageSlug={pageSlug}
                            sectionKey={sectionKey}
                            initialContent={content}
                            onSave={fetchContent}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
