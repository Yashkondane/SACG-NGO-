'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, ExternalLink, Calendar } from 'lucide-react'

// Example data - This would typically come from a CMS or database
const newsletters = [
  {
    id: 1,
    title: 'SACG Community Update - January 2026',
    date: '2026-01-15',
    description: 'Highlights from our new year kickoff event and upcoming cultural festivals.',
    link: '#' // Replace with actual Drive/PDF link
  },
  {
    id: 2,
    title: 'Winter 2025 Newsletter',
    date: '2025-12-20',
    description: 'A look back at our holiday celebrations and volunteer achievements.',
    link: '#'
  },
  {
    id: 3,
    title: 'Fall 2025 Digest',
    date: '2025-09-30',
    description: 'Back to school initiatives and youth program announcements.',
    link: '#'
  }
]

export default function NewsletterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Stay Informed</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Newsletters</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Read our latest updates, community stories, and event recaps directly in your browser.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter List */}
        <section className="py-16 bg-muted min-h-[500px]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-6">
              {newsletters.map((newsletter) => (
                <Card key={newsletter.id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center bg-primary/5 rounded-lg w-full md:w-32 h-32 text-primary border-2 border-primary/10">
                      <FileText className="h-8 w-8 mb-2 opacity-80" />
                      <span className="text-xs font-bold uppercase tracking-wider">PDF</span>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <CardTitle className="text-xl text-primary">{newsletter.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground bg-background px-3 py-1 rounded-full border">
                          <Calendar className="w-3 h-3 mr-2" />
                          {new Date(newsletter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {newsletter.description}
                      </p>
                      <div className="pt-2">
                        <Button asChild variant="default" size="sm" className="gap-2">
                          <a href={newsletter.link} target="_blank" rel="noopener noreferrer">
                            Read Newsletter <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
