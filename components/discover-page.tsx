import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Users } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'
import { Button } from '@/components/ui/button'
import { getPageContent } from '@/lib/content'
import { supabase } from '@/lib/supabase'
import { PartnerWithUsCTA } from '@/components/sponsors/partner-cta'

interface DiscoverPageProps {
  type: 'non-profit' | 'organisation'
  pageSlug: string
  defaultBadge: string
  defaultTitle: string
  defaultDescription: string
  thankYouTitle: string
  thankYouDescription: string
}

export default async function DiscoverPage({
  type,
  pageSlug,
  defaultBadge,
  defaultTitle,
  defaultDescription,
  thankYouTitle,
  thankYouDescription,
}: DiscoverPageProps) {
  const content = await getPageContent(pageSlug)
  const header = content?.header
  const thankYou = content?.thank_you
  const cta = content?.cta

  let items: any[] = []
  try {
    const { data, error } = await supabase
      .from('discover_items')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: true })
    if (error) throw error
    items = data || []
  } catch (error) {
    console.error(`Error fetching ${type}s:`, error)
  }

  const loading = false

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 opacity-95" />
          {/* Decorative pattern */}
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5 mix-blend-overlay"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <FadeIn direction="up">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1 tracking-wide font-medium">{header?.badge || defaultBadge}</Badge>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance drop-shadow-md">{header?.title || defaultTitle}</h1>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
                {header?.description || defaultDescription}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 bg-white relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn direction="up">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">{thankYou?.title || thankYouTitle}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {thankYou?.description || thankYouDescription}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Items Grid */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-xl">No entities listed yet. Check back soon!</p>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {items.map((item) => (
                  <StaggerItem key={item.id} className="h-full">
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group relative">
                      {/* Top accent line */}
                      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>

                      {/* Content Area */}
                      <div className="p-8 flex-1 flex flex-col items-center text-center">
                        {item.logo_url ? (
                          <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-slate-100 flex items-center justify-center bg-white shadow-sm p-2">
                             <img
                                src={item.logo_url}
                                alt={item.name}
                                className="max-w-full max-h-full object-contain"
                             />
                          </div>
                        ) : (
                           <div className="w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-slate-100 flex items-center justify-center bg-slate-100 text-slate-400 group-hover:bg-primary/5 transition-colors shadow-sm">
                             <span className="text-3xl font-bold">{item.name.substring(0, 2).toUpperCase()}</span>
                           </div>
                        )}
                        
                        <h3 className="font-bold text-xl mb-3 text-slate-800 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        
                        {item.description && (
                          <p className="text-slate-600 mb-6 text-sm line-clamp-none leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {item.website_url && (
                          <div className="mt-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary hover:bg-primary/5 gap-2 group-hover:translate-x-1 transition-all duration-300"
                              asChild
                            >
                              <a
                                href={item.website_url}
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
        </section>

        {/* CTA */}
        <FadeIn delay={0.2}>
          <PartnerWithUsCTA
            title={cta?.title || "Get Involved"}
            description={cta?.description || "Reach out to us to feature your organization."}
            buttonText="Contact Us"
            subject={`Inquiry - ${type === 'non-profit' ? 'Non-Profit' : 'Organisation'}`}
            modalTitle="Contact Us"
            modalDescription="Fill out this form and our team will reach out to discuss featuring your organization."
          />
        </FadeIn>
      </main>

      <Footer />
    </div>
  )
}
