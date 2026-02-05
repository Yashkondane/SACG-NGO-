'use client'

import React from "react"

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Calendar, Users, BookOpen, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const pastNewsletters = [
  {
    title: 'February 2026 - New Year Celebrations Recap',
    date: 'February 1, 2026',
    excerpt: 'Highlights from our spectacular New Year celebrations and upcoming spring events.',
  },
  {
    title: 'January 2026 - Welcome to the New Year',
    date: 'January 5, 2026',
    excerpt: 'New year resolutions, community goals, and exciting announcements for 2026.',
  },
  {
    title: 'December 2025 - Holiday Special',
    date: 'December 1, 2025',
    excerpt: 'Year-end reflections, holiday greetings, and a look back at our achievements.',
  },
]

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState({
    events: true,
    news: true,
    community: true,
  })
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would submit to an API
    console.log('Newsletter subscription:', { email, preferences })
    setIsSubscribed(true)
    setTimeout(() => setIsSubscribed(false), 5000)
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
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10" />
              </div>
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Monthly Updates</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">SACG Newsletter</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Stay connected with the latest news, events, and stories from our vibrant community.
              </p>
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Subscription Form */}
              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">Subscribe to Our Newsletter</CardTitle>
                  <CardDescription className="text-base">
                    Get the latest updates delivered directly to your inbox every month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubscribed ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Successfully Subscribed!</h3>
                      <p className="text-muted-foreground">
                        Thank you for subscribing. You'll receive our next newsletter soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="newsletter-email">Email Address *</Label>
                        <Input
                          id="newsletter-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>What would you like to receive?</Label>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="events"
                            checked={preferences.events}
                            onCheckedChange={(checked) => 
                              setPreferences({ ...preferences, events: checked as boolean })
                            }
                          />
                          <label
                            htmlFor="events"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Event announcements and updates
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="news"
                            checked={preferences.news}
                            onCheckedChange={(checked) => 
                              setPreferences({ ...preferences, news: checked as boolean })
                            }
                          />
                          <label
                            htmlFor="news"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Community news and announcements
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="community"
                            checked={preferences.community}
                            onCheckedChange={(checked) => 
                              setPreferences({ ...preferences, community: checked as boolean })
                            }
                          />
                          <label
                            htmlFor="community"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Member stories and spotlights
                          </label>
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Subscribe Now
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By subscribing, you agree to receive emails from SACG. You can unsubscribe at any time.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* What to Expect */}
              <div className="space-y-6">
                <Card className="border-2 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">What to Expect</CardTitle>
                    <CardDescription className="text-base">
                      Our monthly newsletter includes:
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4 group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Calendar className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Upcoming Events</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Be the first to know about festivals, workshops, and community gatherings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Users className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Community Highlights</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Member stories, achievements, and community milestones.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <BookOpen className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Cultural Insights</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Learn about traditions, festivals, and cultural practices.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Monthly Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Newsletters are sent on the first Monday of each month. You can manage your subscription 
                      preferences or unsubscribe at any time using the link in every email.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Past Newsletters */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Past Newsletters</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Browse our newsletter archives and catch up on community updates
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pastNewsletters.map((newsletter) => (
                <Card key={newsletter.title} className="border-2 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{newsletter.title}</CardTitle>
                    <CardDescription className="font-medium">{newsletter.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{newsletter.excerpt}</p>
                    <Button variant="outline" className="w-full bg-transparent group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                      Read Archive
                    </Button>
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
