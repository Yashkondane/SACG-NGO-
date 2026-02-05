import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'

const upcomingEvents = [
  {
    id: 1,
    title: 'Diwali Celebration 2026',
    date: 'November 15, 2026',
    time: '6:00 PM - 10:00 PM',
    location: 'New Haven Community Center',
    description: 'Join us for a spectacular Diwali celebration featuring traditional performances, delicious food, and a beautiful diya lighting ceremony.',
    attendees: 200,
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Holi Festival of Colors',
    date: 'March 20, 2027',
    time: '2:00 PM - 6:00 PM',
    location: 'Edgewood Park',
    description: 'Celebrate the festival of colors with music, dance, and traditional colors. A family-friendly event for all ages.',
    attendees: 150,
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'South Asian Cultural Workshop',
    date: 'April 10, 2027',
    time: '3:00 PM - 5:00 PM',
    location: 'SACG Community Hall',
    description: 'Learn about traditional art forms, music, and dance from expert instructors. Workshop includes hands-on activities.',
    attendees: 50,
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Annual Picnic & Sports Day',
    date: 'June 5, 2027',
    time: '11:00 AM - 5:00 PM',
    location: 'Lighthouse Point Park',
    description: 'A day of fun with family and friends featuring cricket, volleyball, traditional games, and a community potluck.',
    attendees: 180,
    status: 'upcoming',
  },
]

const pastEvents = [
  {
    id: 5,
    title: 'Navratri Garba Night',
    date: 'October 8, 2025',
    location: 'New Haven Ballroom',
    attendees: 220,
  },
  {
    id: 6,
    title: 'Independence Day Celebration',
    date: 'August 15, 2025',
    location: 'SACG Community Hall',
    attendees: 150,
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Upcoming & Past</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Community Events</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Join us for cultural celebrations, workshops, and community gatherings that bring our community together and create lasting memories.
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
            <div className="grid gap-8 max-w-5xl mx-auto">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-2 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">{event.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="self-start bg-primary/10 text-primary border-primary/20">
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{event.attendees} expected</span>
                      </div>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto">Register Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Past Events */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Past Events</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Celebrating our successful community gatherings
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {pastEvents.map((event) => (
                <Card key={event.id} className="border-2 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{event.attendees} attendees</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
