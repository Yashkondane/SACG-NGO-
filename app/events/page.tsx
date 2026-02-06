'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })

        if (error) throw error
        setEvents(data || [])
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const now = new Date()
  const upcomingEvents = events.filter(e => new Date(e.date) >= now)
  const pastEvents = events.filter(e => new Date(e.date) < now).reverse() // Show most recent past event first

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Helper to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Community Gatherings</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Events</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Join us for cultural celebrations, workshops, and community gatherings.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Upcoming Events</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Mark your calendars for these exciting upcoming celebrations
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted-foreground">Loading events...</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-10 bg-muted/30 rounded-lg">
                <p className="text-xl text-muted-foreground">No upcoming events scheduled at the moment.</p>
                <p className="mt-2 text-muted-foreground">Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-8 max-w-5xl mx-auto">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="border-2 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Event Image (Left on Desktop) */}
                      <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                        <Image
                          src={event.image_url || "/images/logo.jpg"} // Fallback image
                          alt={event.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Content (Right) */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                              Upcoming
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>{formatTime(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground line-clamp-2 mb-6">{event.excerpt}</p>
                        </div>

                        <Button asChild className="w-full sm:w-auto self-start group/btn">
                          <Link href={`/events/${event.id}`}>
                            Know More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Past Events</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Celebrating our successful community gatherings
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="border hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative w-full aspect-video">
                      <Image
                        src={event.image_url || "/images/logo.jpg"}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover rounded-t-lg grayscale hover:grayscale-0 transition-all duration-500"
                      />                 </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> {formatDate(event.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-3">{event.excerpt}</p>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/events/${event.id}`}>View Recap</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
