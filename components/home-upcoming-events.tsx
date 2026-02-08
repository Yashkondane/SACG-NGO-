'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { EventList } from '@/components/event-list'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

export function HomeUpcomingEvents() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .gte('date', new Date().toISOString())
                    .neq('category', 'health')
                    .order('date', { ascending: true })
                    .limit(3)

                if (error) throw error
                setEvents(data || [])
            } catch (error) {
                console.error('Error fetching home upcoming events:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    return (
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <FadeIn direction="up">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Upcoming Events</h2>
                        <div className="w-24 h-1.5 bg-white/20 mx-auto rounded-full mb-6"></div>
                    </FadeIn>
                    <FadeIn delay={0.2} direction="up">
                        <p className="text-xl text-primary-foreground/90 leading-relaxed">
                            Join us for our next community gatherings to celebrate culture, build connections, and support one another.
                        </p>
                    </FadeIn>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                ) : (
                    <>
                        <FadeIn delay={0.3}>
                            <div className="mb-12">
                                <EventList events={events} emptyMessage="No upcoming events scheduled at the moment. Check back soon!" />
                            </div>
                        </FadeIn>

                        <div className="flex justify-center">
                            <FadeIn delay={0.4} direction="up">
                                <Button asChild size="lg" variant="secondary" className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 gap-2 hover:scale-105">
                                    <Link href="/events">
                                        View All Events <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </Button>
                            </FadeIn>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
