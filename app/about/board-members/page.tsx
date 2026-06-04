import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { FadeIn } from '@/components/ui/fade-in'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getPageContent } from '@/lib/content'

export const revalidate = 60 // Revalidate every 60 seconds

async function getBoardMembers() {
  const { data, error } = await supabase
    .from('board_members')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching board members:', error)
    return []
  }
  return data || []
}

export default async function BoardMembersPage() {
  const members = await getBoardMembers()
  const content = await getPageContent('about')
  const intro = content?.members_intro

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header Section */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn direction="up">
                <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">{intro?.badge || "Leadership"}</Badge>
              </FadeIn>
              <FadeIn delay={0.2} direction="up">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">{intro?.title || "Board Members"}</h1>
              </FadeIn>
              <FadeIn delay={0.4} direction="up">
                <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                  {intro?.description || "Meet the dedicated individuals who lead our organization and guide our mission to serve the community."}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Board Members List */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="space-y-24 md:space-y-32">
              {members.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  Our board member profiles will be updated soon.
                </div>
              ) : (
                members.map((member, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <div 
                      key={member.id} 
                      className={`flex flex-col gap-10 md:gap-16 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Image Side */}
                      <div className="w-full sm:w-[80%] md:w-[40%] lg:w-[35%] flex-shrink-0">
                        <FadeIn delay={0.2} direction={isEven ? "right" : "left"}>
                          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 group">
                            {member.image_url ? (
                              <Image
                                src={member.image_url}
                                alt={member.name}
                                fill
                                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <span className="text-sm font-medium uppercase tracking-wider">No Image</span>
                              </div>
                            )}
                          </div>
                        </FadeIn>
                      </div>
                      
                      {/* Text Side */}
                      <div className="w-full md:w-[60%] lg:w-[65%] space-y-6 text-center md:text-left">
                        <FadeIn delay={0.4} direction={isEven ? "left" : "right"}>
                          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            {member.name}
                          </h2>
                          <div className="h-1 w-12 bg-primary/20 rounded-full mb-8 mx-auto md:mx-0" />
                          <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {member.description}
                          </div>
                        </FadeIn>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
