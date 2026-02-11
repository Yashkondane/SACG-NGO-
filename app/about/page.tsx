import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Linkedin, Users, Heart, Award } from 'lucide-react'
import Image from 'next/image'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'



export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn direction="up">
                <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Our Journey</Badge>
              </FadeIn>
              <FadeIn delay={0.2} direction="up">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">About SACG</h1>
              </FadeIn>
              <FadeIn delay={0.4} direction="up">
                <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                  Celebrating South Asian culture, fostering community connections, and building lasting memories in Greater New Haven since 2010.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Stats Section */}


        {/* Our Story */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <FadeIn direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Our Story</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  From humble beginnings to a thriving community
                </p>
              </div>
            </FadeIn>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Text Content - Left Side */}
              <div className="flex-1 space-y-6">
                <FadeIn delay={0.2} direction="right">
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      The South Asian Community of Greater New Haven (SACG) was born from a simple yet powerful idea: to create a space where South Asians could come together, celebrate their heritage, and support one another in navigating life in a new country.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      What started as informal gatherings quickly grew into something much bigger—a movement focused on preserving cultural identity, bridging the gap between traditions, and building a sense of belonging in a broader community. The seed of this effort was sowed one fall evening, when the founders met over chai (of course!), and that set the stage for what has blossomed and continues to grow: our SACG!
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      With several successful and multi-faceted events under our belt, we formally registered as a 501(c)3 in July 2025. We are committed to building a welcoming home for the South Asian community of Greater New Haven—one rooted in culture, connection, and care.
                    </p>
                  </div>
                </FadeIn>
              </div>

              {/* Image - Right Side */}
              <div className="flex-1 w-full">
                <FadeIn delay={0.4} direction="left">
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                    <Image
                      src="/images/about-team.jpg"
                      alt="SACG community members in traditional attire"
                      fill
                      loading="lazy"
                      quality={85}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>



        {/* Values */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <FadeIn direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Our Core Values</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  The principles that guide everything we do
                </p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StaggerItem>
                <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group h-full">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                      <Users className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-2xl text-primary">Community First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We prioritize the needs and wellbeing of our community members, creating spaces where everyone feels welcome and valued.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group h-full">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                      <Heart className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-2xl text-primary">Cultural Pride</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We celebrate our rich South Asian heritage while embracing the diversity that makes our community unique and vibrant.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group h-full">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                      <Award className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-2xl text-primary">Inclusive Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We believe in continuous learning and growth, fostering an environment where all voices are heard and respected.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
