'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { supabase } from '@/lib/supabase'
import { EventList } from '@/components/event-list'
import { Loader2 } from 'lucide-react'

export default function PastEventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .lt('date', new Date().toISOString())
                    .neq('category', 'health')
                    .order('date', { ascending: false })

                if (error) throw error
                setEvents(data || [])
            } catch (error) {
                console.error('Error fetching past events:', error)
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
                        <h1 className="text-4xl font-bold mb-4">Past Events</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Reflecting on the moments that brought us together. From cultural celebrations to community workshops, explore the memories we've created and the impact we've made in the South Asian community.
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
                            <EventList events={events} emptyMessage="No past events found." />
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
