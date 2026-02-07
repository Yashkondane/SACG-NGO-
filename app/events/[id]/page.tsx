'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { GalleryGrid } from '@/components/gallery-grid'

export default function EventDetailPage() {
    const { id } = useParams()
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEvent() {
            if (!id) return

            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setEvent(data)
            } catch (error) {
                console.error('Error fetching event:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl font-bold">Event not found</h1>
                    <Button asChild>
                        <Link href="/events/upcoming">Back to Events</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const dateObj = new Date(event.date)
    const isUpcoming = dateObj >= new Date()
    const isHealth = event.category === 'health'

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1 pt-16">
                {/* Hero Section with Image Background */}
                <div className="relative w-full h-[40vh] min-h-[300px]">
                    {event.image_url ? (
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                            quality={100}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-24 w-24 text-primary/20" />
                        </div>
                    )}
                </div>

                {/* Event Header Content */}
                <div className="container mx-auto px-4 -mt-12 relative z-10">
                    <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg border">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Button asChild variant="outline" size="sm" className="hover:bg-accent">
                                <Link href="/events/upcoming">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                                </Link>
                            </Button>
                            <Badge className={`text-sm px-3 py-1 ${isUpcoming ? 'bg-primary' : 'bg-muted-foreground'}`}>
                                {isUpcoming ? 'Upcoming' : 'Past Event'}
                            </Badge>
                            {isHealth && (
                                <Badge variant="secondary" className="text-sm px-3 py-1 bg-green-100 text-green-800 hover:bg-green-100">
                                    Health Awareness
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-2">
                            {event.title}
                        </h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="lead text-2xl text-muted-foreground font-medium border-l-4 border-primary pl-4">
                                {event.excerpt}
                            </p>
                            <div className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
                                {event.content}
                            </div>
                        </div>

                        {/* Event Gallery Section */}
                        <div className="pt-12 border-t">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                Event Gallery
                            </h2>
                            <GalleryGrid eventId={id as string} />
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-8">
                        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6 sticky top-24">
                            <h3 className="font-semibold text-xl border-b pb-4">Event Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Date</p>
                                        <p className="text-muted-foreground">
                                            {dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/New_York' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Time</p>
                                        <p className="text-muted-foreground">
                                            {dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York', timeZoneName: 'short' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Location</p>
                                        <p className="text-muted-foreground">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
