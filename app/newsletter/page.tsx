'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, FileText, Loader2, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setNewsletters(data || [])
      } catch (error) {
        console.error('Error fetching newsletters:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsletters()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <FadeIn direction="up">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Community Updates</Badge>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">SACG Newsletters</h1>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                Stay connected with our community through our monthly newsletters matching events, updates, and stories.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Newsletter Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : newsletters.length === 0 ? (
              <FadeIn direction="up">
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-100 max-w-2xl mx-auto">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No Newsletters Yet</h3>
                  <p className="text-slate-500">Check back soon for our latest community updates!</p>
                </div>
              </FadeIn>
            ) : (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {newsletters.map((newsletter) => (
                  <StaggerItem key={newsletter.id}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 overflow-hidden flex flex-col group h-full">
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                              {newsletter.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(newsletter.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
                          Click below to view the full newsletter document in a new tab.
                        </p>

                        <Button className="w-full gap-2 group-hover:bg-primary/90" asChild>
                          <a href={newsletter.link} target="_blank" rel="noopener noreferrer">
                            Read Newsletter <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
