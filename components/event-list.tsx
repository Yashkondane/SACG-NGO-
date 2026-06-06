'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'

interface Event {
    id: string
    title: string
    date: string
    location: string
    excerpt: string
    image_url?: string
    category: string
    is_tbd?: boolean
}

interface EventListProps {
    events: Event[]
    emptyMessage?: string
}

export function EventList({ events, emptyMessage = "No events found." }: EventListProps) {
    if (events.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-xl">{emptyMessage}</p>
            </div>
        )
    }

    const parseLocation = (locStr: string) => {
        if (!locStr) return { venue: '', address: '', mapUrl: '', eventUrl: '' };
        try {
            const parsed = JSON.parse(locStr);
            if (parsed && typeof parsed === 'object') {
                return {
                    venue: parsed.venue || '',
                    address: parsed.address || '',
                    mapUrl: parsed.mapUrl || '',
                    eventUrl: parsed.eventUrl || ''
                };
            }
        } catch(e) {}
        return { venue: locStr, address: '', mapUrl: '', eventUrl: '' };
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {events.map((event) => {
                const loc = parseLocation(event.location)
                const href = loc.eventUrl || `/events/${event.id}`
                return (
                <Link href={href} key={event.id} className="block h-full group min-w-0 w-full">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-0 bg-card min-w-0">
                        {event.image_url ? (
                            <div className="relative h-48 w-full overflow-hidden bg-muted/30 flex items-center justify-center p-2">
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            <div className="h-48 w-full bg-muted flex items-center justify-center">
                                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}
                        <CardHeader className="min-w-0">
                            <div className="flex justify-between items-start gap-2 min-w-0">
                                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors min-w-0">{event.title}</CardTitle>
                                {event.category === 'health' && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 shrink-0">Health</Badge>
                                )}
                            </div>
                            <CardDescription className="flex flex-col gap-1 mt-2 min-w-0 w-full">
                                <span className="flex items-center gap-2 text-sm min-w-0 w-full">
                                    <Calendar className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        {event.is_tbd ? 'TBD' : `${new Date(event.date).toLocaleDateString()} at ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </span>
                                </span>
                                <span className="flex items-center gap-2 text-sm min-w-0 w-full">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{loc.venue || event.location}</span>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        {event.excerpt && (
                            <CardContent className="flex-1 min-w-0">
                                <div 
                                    className="text-sm text-muted-foreground line-clamp-3 prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-p:leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: event.excerpt }}
                                />
                            </CardContent>
                        )}
                    </Card>
                </Link>
            )})}
        </div>
    )
}
