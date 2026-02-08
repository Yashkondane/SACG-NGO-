'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, HandHeart, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'
import { Button } from '@/components/ui/button'

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .order('created_at', { ascending: true }) // Fallback to created_at or display_order if valid

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 opacity-95" />
          {/* Decorative pattern */}
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opencity-5 mix-blend-overlay"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <FadeIn direction="up">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1 tracking-wide font-medium">Community Partners</Badge>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance drop-shadow-md">Our Sponsors</h1>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
                We are deeper grateful for the vision and generosity of these organizations. Their support empowers us to serve and uplift the South Asian community.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Introduction & Thank You */}
        <section className="py-20 bg-white relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn direction="up">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <HandHeart className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">Thank You to Our Partners</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Our partners are the backbone of our community efforts. Through their generous contributions, we are able to curate enriching cultural events, advocate for community well-being, and build a stronger, more connected South Asian diaspora. We proudly recognize their commitment and encourage you to engage with the businesses and organizations that make our mission possible.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Sponsors Grid */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : sponsors.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-xl">No sponsors listed listed yet. Check back soon!</p>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {sponsors.map((sponsor) => (
                  <StaggerItem key={sponsor.id} className="h-full">
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group relative">
                      {/* Top accent line */}
                      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>

                      {/* Logo Area */}
                      <div className="aspect-[4/3] p-8 flex items-center justify-center bg-slate-50/50 group-hover:bg-white transition-colors duration-300">
                        {sponsor.logo_url ? (
                          <img
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain transition-all duration-300 transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 group-hover:text-primary/50 transition-colors">
                            <span className="text-4xl font-bold">{sponsor.name.substring(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex-1 flex flex-col text-center border-t border-slate-50">
                        <h3 className="font-bold text-lg mb-2 text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                          {sponsor.name}
                        </h3>

                        {sponsor.website_url && (
                          <div className="mt-auto pt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary hover:bg-primary/5 gap-2 group-hover:translate-x-1 transition-all duration-300"
                              asChild
                            >
                              <a
                                href={sponsor.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visit Website <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section >

        {/* Become a Sponsor CTA */}
        <FadeIn delay={0.2}>
          <section className="py-24 bg-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-10 pattern-dots"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Partner With Us</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join our mission to celebrate culture and community in Greater New Haven.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                asChild
              >
                <a href="mailto:info@sacg.org">
                  Become a Sponsor
                </a>
              </Button>
            </div>
          </section>
        </FadeIn>
      </main >

      <Footer />
    </div >
  )
}
