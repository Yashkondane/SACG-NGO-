'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Users, Calendar, Info, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) throw error
        setSponsors(data || [])
      } catch (error) {
        console.error('Error fetching sponsors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSponsors()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Community Partners</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Our Sponsors</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                We are grateful for the support of these organizations that help us serve the South Asian community.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Thank You to Our Partners</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      Our partners are the backbone of our community efforts. Through their generous contributions, we are able to curate enriching cultural events, advocate for community well-being, and build a stronger, more connected South Asian diaspora. We proudly recognize their commitment and encourage you to engage with the businesses and organizations that make our mission possible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : sponsors.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-xl">No sponsors listed yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {sponsors.map((sponsor) => (
                  <Card key={sponsor.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 bg-card h-full flex flex-col">
                    <div className="aspect-square relative bg-white p-6 flex items-center justify-center border-b text-4xl font-bold text-primary/20">
                      {sponsor.logo_url ? (
                        <img
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span>{sponsor.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col text-center">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{sponsor.name}</h3>
                      {sponsor.website_url && (
                        <div className="mt-auto pt-4">
                          <a
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            Visit Website <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section >

        {/* Become a Sponsor */}
        < section className="py-20 bg-background" >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Interested in becoming a sponsor?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Partner with SACG to reach the vibrant South Asian community of Greater New Haven.
              </p>
              <a
                href="mailto:info@sacg.org"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section >
      </main >

      <Footer />
    </div >
  )
}
