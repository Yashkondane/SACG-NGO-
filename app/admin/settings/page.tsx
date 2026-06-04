'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SectionEditor } from '@/components/admin/section-editor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

export default function SettingsAdminPage() {
  const pageSlug = 'global-settings'
  const [activeTab, setActiveTab] = useState('header')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetchContent()
  }, [activeTab])

  const fetchContent = async () => {
    setLoading(true)
    try {
        const { data, error } = await supabase
            .from('page_content')
            .select('content')
            .eq('page_slug', pageSlug)
            .eq('section_key', activeTab)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching content:', error)
        }

        const defaultContent = DEFAULT_PAGE_CONTENT[pageSlug]?.[activeTab] || {}
        setContent(data?.content && Object.keys(data.content).length > 0 ? data.content : defaultContent)
    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Global Settings</h2>
        <p className="text-muted-foreground">
          Manage your website's header navigation, footer links, and global details.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="header">Header Links</TabsTrigger>
          <TabsTrigger value="footer">Footer Links</TabsTrigger>
          <TabsTrigger value="details">Footer Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="header">
          <Card>
            <CardHeader>
              <CardTitle>Header Navigation Links</CardTitle>
              <CardDescription>
                Define the links in your top navigation bar. Type a name in the "Parent Dropdown" field to group links together under a dropdown menu! Leave it blank for a top-level link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                  <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
              ) : (
                  <div key={`${pageSlug}-${activeTab}`}>
                      <SectionEditor 
                        pageSlug="global-settings" 
                        sectionKey="header" 
                        initialContent={content} 
                        arrayDisplayMode="table"
                        onSave={fetchContent} 
                      />
                  </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer Links</CardTitle>
              <CardDescription>
                Manage the links in the bottom footer. Use the "Column Name" field to group links into different columns (e.g. "Quick Links", "Connect").
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                  <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
              ) : (
                  <div key={`${pageSlug}-${activeTab}`}>
                      <SectionEditor 
                        pageSlug="global-settings" 
                        sectionKey="footer" 
                        initialContent={content} 
                        arrayDisplayMode="table"
                        onSave={fetchContent} 
                      />
                  </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Footer Details & Socials</CardTitle>
              <CardDescription>
                Update the mission statement and social media links displayed in the footer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                  <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
              ) : (
                  <div key={`${pageSlug}-${activeTab}`}>
                      <SectionEditor 
                        pageSlug="global-settings" 
                        sectionKey="details" 
                        initialContent={content} 
                        onSave={fetchContent} 
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
