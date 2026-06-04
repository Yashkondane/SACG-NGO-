'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { SectionEditor } from '@/components/admin/section-editor'
import { Loader2 } from 'lucide-react'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

const EVENTS_SECTIONS = [
    { key: 'hub', name: 'Events Hub (Main Page)' },
    { key: 'upcoming', name: 'Upcoming Events' },
    { key: 'past', name: 'Past Events' },
    { key: 'health', name: 'Health Awareness' },
]

export default function EventsPagesAdmin() {
    const pageSlug = 'events'
    const [sectionKey, setSectionKey] = useState(EVENTS_SECTIONS[0].key)
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState<any>(null)

    useEffect(() => {
        fetchContent()
    }, [sectionKey])

    const fetchContent = async () => {
        setLoading(true)
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
            setContent(data?.content && Object.keys(data.content).length > 0 ? data.content : defaultContent)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events Pages Content</h1>
                    <p className="text-muted-foreground">Manage the content for the Events Hub and its sub-pages.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="w-full">
                        <Label className="mb-2 block">Select Section to Edit</Label>
                        <Tabs value={sectionKey} onValueChange={setSectionKey} className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
                                {EVENTS_SECTIONS.map(s => (
                                    <TabsTrigger key={s.key} value={s.key}>{s.name}</TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div key={`${pageSlug}-${sectionKey}`}>
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
        </div>
    )
}
