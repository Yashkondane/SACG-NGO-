'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, History, HeartPulse, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Events Hub</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Explore our community gatherings, past celebrations, and health initiatives.
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Upcoming Events Card */}
              <Link href="/events/upcoming" className="group">
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors z-10"></div>
                    <Image
                      src="/images/cultural-events.jpg" // Using existing image or placeholder
                      alt="Upcoming Events"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-white/90 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                        <Calendar className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Stay up to date with our schedule of festivals, workshops, and community gatherings.
                    </p>
                    <span className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      View Schedule <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Past Events Card */}
              <Link href="/events/past" className="group">
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors z-10"></div>
                    <Image
                      src="/images/community-building.jpg" // Using existing image or placeholder
                      alt="Past Events"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-white/90 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                        <History className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">Past Events</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Browse through our gallery and memories from previous celebrations and successful events.
                    </p>
                    <span className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      Explore Memories <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Health Awareness Card */}
              <Link href="/events/health" className="group">
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors z-10"></div>
                    <Image
                      src="/images/social-support.jpg" // Using existing image or placeholder
                      alt="Health Awareness"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-white/90 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                        <HeartPulse className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">Health Awareness</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Discover our dedicated health initiatives, medical camps, and wellness workshops.
                    </p>
                    <span className="inline-flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
