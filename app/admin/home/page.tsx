'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { SectionEditor } from '@/components/admin/section-editor'
import { Loader2 } from 'lucide-react'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

const HOME_SECTIONS = [
    { key: 'hero', name: 'Hero' },
    { key: 'mission', name: 'Mission' },
    { key: 'goal', name: 'Goal' },
    { key: 'what_we_do', name: 'What We Do' },
    { key: 'faq', name: 'FAQ' },
    { key: 'join_community', name: 'Community' },
]

export default function HomePageEditor() {
    const pageSlug = 'home'
    const [sectionKey, setSectionKey] = useState(HOME_SECTIONS[0].key)
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
                    <h1 className="text-3xl font-bold tracking-tight">Home Page Content</h1>
                    <p className="text-muted-foreground">Edit text, hero images, and sections of the landing page.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="w-full">
                        <Label className="mb-2 block">Select Section to Edit</Label>
                        <Tabs value={sectionKey} onValueChange={setSectionKey} className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
                                {HOME_SECTIONS.map(s => (
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
