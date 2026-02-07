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

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="block h-full group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-0 bg-card">
                        {event.image_url ? (
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            <div className="h-48 w-full bg-muted flex items-center justify-center">
                                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                                {event.category === 'health' && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Health</Badge>
                                )}
                            </div>
                            <CardDescription className="flex flex-col gap-1 mt-2">
                                <span className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {event.excerpt}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
