'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { supabase } from '@/lib/supabase'
import { EventList } from '@/components/event-list'
import { Loader2 } from 'lucide-react'

export default function HealthEventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('category', 'health')
                    .order('date', { ascending: false })

                if (error) throw error
                setEvents(data || [])
            } catch (error) {
                console.error('Error fetching health events:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 pt-16">
                <section className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold mb-4">Health Awareness</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Empowering our community through knowledge and wellness. Join our expert-led sessions, health screenings, and fitness workshops designed to promote a healthier lifestyle for everyone.
                        </p>
                    </div>
                </section>

                <section className="py-12 bg-background">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            </div>
                        ) : (
                            <EventList events={events} emptyMessage="No health awareness events found." />
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
