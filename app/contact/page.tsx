'use client'

import React from "react"

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would submit to an API
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
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
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Get In Touch</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Contact Us</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Have questions, feedback, or want to get involved? We'd love to hear from you and connect!
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <Card className="border-2 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Send Us a Message</CardTitle>
                    <CardDescription className="text-base">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(203) 555-0123"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                          required
                        >
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="membership">Membership Information</SelectItem>
                            <SelectItem value="events">Event Question</SelectItem>
                            <SelectItem value="volunteer">Volunteer Opportunity</SelectItem>
                            <SelectItem value="donation">Donation Question</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us how we can help..."
                          rows={6}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="border-2 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Get in Touch</CardTitle>
                    <CardDescription className="text-base">
                      Reach out to us through any of these channels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4 group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Mail className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                        <a href="mailto:info@sacg.org" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                          info@sacg.org
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Phone className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Phone</h3>
                        <a href="tel:+12035550100" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                          (203) 555-0100
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <MapPin className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Address</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          123 Community Lane<br />
                          New Haven, CT 06511
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Clock className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Office Hours</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Monday - Friday: 9:00 AM - 5:00 PM<br />
                          Saturday: 10:00 AM - 2:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Need Immediate Assistance?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      For urgent matters or event-related questions, please call our main line during office hours.
                    </p>
                    <Button variant="outline" size="lg" className="w-full bg-transparent hover:bg-primary hover:text-white hover:border-primary transition-all" asChild>
                      <a href="tel:+12035550100">Call Now</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
