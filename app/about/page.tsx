import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Linkedin, Users, Heart, Calendar, Award } from 'lucide-react'
import Image from 'next/image'

const founders = [
  {
    name: 'Founder 1',
    role: 'Founder & President',
    bio: 'Community leader with over 15 years of experience in cultural advocacy and building bridges between diverse communities.',
    email: 'founder1@sacg.org',
    linkedin: '#',
  },
  {
    name: 'Founder 2',
    role: 'Co-Founder & Vice President',
    bio: 'Entrepreneur and philanthropist dedicated to supporting community initiatives celebrating South Asian heritage.',
    email: 'founder2@sacg.org',
    linkedin: '#',
  },
  {
    name: 'Founder 3',
    role: 'Director of Programs',
    bio: 'Expert in event management and cultural programming, ensuring every SACG event is meaningful and memorable.',
    email: 'founder3@sacg.org',
    linkedin: '#',
  },
  {
    name: 'Founder 4',
    role: 'Director of Community Outreach',
    bio: 'Passionate about connecting people and building lasting relationships throughout the Greater New Haven region.',
    email: 'founder4@sacg.org',
    linkedin: '#',
  },
]

const stats = [
  {
    icon: Users,
    value: '500+',
    label: 'Active Members',
  },
  {
    icon: Calendar,
    value: '50+',
    label: 'Annual Events',
  },
  {
    icon: Heart,
    value: '15+',
    label: 'Years of Service',
  },
  {
    icon: Award,
    value: '100+',
    label: 'Community Partners',
  },
]

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
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Our Journey</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">About SACG</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Celebrating South Asian culture, fostering community connections, and building lasting memories in Greater New Haven since 2010.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Our Story</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From humble beginnings to a thriving community
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Text Content - Left Side */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">The Beginning (2010)</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        SACG was established by visionary community members who recognized the need for a unified platform to celebrate South Asian culture and heritage in Greater New Haven.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Growth & Evolution</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        What began as small gatherings in living rooms has grown into a thriving organization serving hundreds of families, organizing cultural events, educational programs, and community initiatives.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Today & Beyond</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        SACG stands as a beacon of cultural pride and community unity, bringing together people from diverse South Asian backgrounds to celebrate traditions and contribute positively to Greater New Haven.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image - Right Side */}
              <div className="flex-1 w-full">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                  <Image
                    src="/images/about-us.jpg"
                    alt="SACG community leaders at an outdoor event"
                    fill
                    loading="lazy"
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders & Directors */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Meet Our Founders</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Dedicated leaders committed to celebrating culture and building community
              </p>
            </div>

            {/* Portrait Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {founders.map((founder, index) => (
                <div key={founder.name} className="group">
                  <Card className="overflow-hidden border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                    {/* Portrait Image with Overlay Info */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                      {/* Placeholder Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-bold text-white/20">
                          {founder.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Info Overlay on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <h3 className="font-bold text-xl mb-1 text-balance">{founder.name}</h3>
                        <p className="text-sm text-white/90 mb-3 font-medium">{founder.role}</p>
                        <p className="text-sm text-white/80 leading-relaxed mb-4 line-clamp-3">
                          {founder.bio}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                          <a
                            href={`mailto:${founder.email}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                            aria-label={`Email ${founder.name}`}
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                          <a
                            href={founder.linkedin}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                            aria-label={`LinkedIn profile of ${founder.name}`}
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Our Core Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
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

              <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
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

              <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
