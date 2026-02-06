'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

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
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!event) {
        return <div className="min-h-screen flex items-center justify-center">Event not found</div>
    }

    const dateObj = new Date(event.date)
    const isUpcoming = dateObj >= new Date()

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1 pt-20">
                {/* Hero Image Section */}
                <div className="relative h-[400px] md:h-[500px] w-full">
                    <Image
                        src={event.image_url || "/images/logo.jpg"}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container mx-auto">
                        <Button asChild variant="outline" size="sm" className="mb-6 bg-background/50 backdrop-blur border-none hover:bg-background/80">
                            <Link href="/events">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                            </Link>
                        </Button>
                        <Badge className={`mb-4 ${isUpcoming ? 'bg-primary' : 'bg-muted-foreground'}`}>
                            {isUpcoming ? 'Upcoming Event' : 'Past Event'}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-4xl shadow-sm">
                            {event.title}
                        </h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">

                    {/* Main Content (Left) */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="lead text-xl text-muted-foreground font-medium">
                                {event.excerpt}
                            </p>
                            <div className="mt-8 whitespace-pre-wrap">
                                {event.content}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        <div className="bg-muted/50 p-6 rounded-xl border space-y-6 sticky top-24">
                            <h3 className="font-semibold text-lg border-b pb-4">Event Details</h3>

                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Date</p>
                                    <p className="text-muted-foreground">
                                        {dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Time</p>
                                    <p className="text-muted-foreground">
                                        {dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-muted-foreground">{event.location}</p>
                                </div>
                            </div>

                            {isUpcoming && (
                                <Button size="lg" className="w-full mt-4">
                                    Register Now
                                </Button>
                            )}
                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    )
}
