'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { SectionEditor } from '@/components/admin/section-editor'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

export default function ContactAdminPage() {
    const pageSlug = 'contact'
    const [pageContent, setPageContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchPageContent = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('*')
                .eq('page_slug', pageSlug)

            if (error) {
                console.error('Error fetching content:', error)
                return
            }

            const formattedContent: any = {}
            if (data) {
                data.forEach(item => {
                    formattedContent[item.section_key] = item.content
                })
            }
            
            // Merge with defaults if missing
            const defaults = DEFAULT_PAGE_CONTENT[pageSlug] || {}
            const finalContent = { ...defaults }
            
            Object.keys(defaults).forEach(key => {
                if (formattedContent[key] && Object.keys(formattedContent[key]).length > 0) {
                    finalContent[key] = formattedContent[key]
                }
            })

            setPageContent(finalContent)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPageContent()
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Page Content</h1>
                    <p className="text-muted-foreground">Manage the text, email, phone, and address on the Contact Us page.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Header</CardTitle>
                            <CardDescription>Edit the introductory text at the top of the Contact page.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SectionEditor
                                pageSlug={pageSlug}
                                sectionKey="header"
                                initialContent={pageContent?.header}
                                onSave={fetchPageContent}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>Update your email, phone number, physical address, and office hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SectionEditor
                                pageSlug={pageSlug}
                                sectionKey="details"
                                initialContent={pageContent?.details}
                                onSave={fetchPageContent}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
