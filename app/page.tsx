'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Heart } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { InteractiveCard } from '@/components/interactive-card'
import { TestimonialsCarousel } from '@/components/testimonials-carousel'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const whatWeDoItems = [
    {
      image: '/images/cultural-events.jpg',
      title: 'Cultural Events',
      description: 'Celebrate festivals, traditions, and cultural milestones together through vibrant performances and gatherings'
    },
    {
      image: '/images/community-building.jpg',
      title: 'Community Building',
      description: 'Connect with neighbors and build lasting friendships across generations and backgrounds'
    },
    {
      image: '/images/social-support.jpg',
      title: 'Social Support',
      description: 'Provide resources and assistance to community members in times of need'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        {/* Slider Images */}
        <div className="absolute inset-0 w-full h-full">
          {[
            '/images/hero.jpg',
            '/images/sacg-banner.png'
          ].map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <Image
                src={src}
                alt={`SACG Slide ${index + 1}`}
                fill
                priority={index === 0}
                quality={90}
                className="object-cover"
                sizes="100vw"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance drop-shadow-lg">
            Building Bridges, Celebrating Culture
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance drop-shadow-md">
            The South Asian Community of Greater New Haven brings together diverse voices to create a vibrant, inclusive community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg gap-2">
                  <Heart className="w-5 h-5 fill-current" />
                  Support Our Mission
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center text-primary mb-2">
                    Support Community. Celebrate Culture. Build Belonging.
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <p className="text-muted-foreground leading-relaxed text-center">
                    Your generosity helps the South Asian Community of Greater New Haven create meaningful programs, strengthen connections, and ensure our community continues to thrive.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <p className="text-sm text-center font-medium">
                      Every donation large or small directly supports our mission to celebrate cultural heritage, foster inclusion, encourage civic engagement, and build a welcoming space for South Asians across Greater New Haven.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-primary text-center">Ways to Give</h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors bg-card">
                        <h4 className="font-semibold mb-2">One-Time Donation</h4>
                        <p className="text-sm text-muted-foreground">Make an immediate impact by supporting our current programs and initiatives.</p>
                      </div>
                      <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors bg-card">
                        <h4 className="font-semibold mb-2">Monthly Giving</h4>
                        <p className="text-sm text-muted-foreground">Become a sustaining supporter and help ensure long-term stability and growth for our community.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8">
                      <a
                        href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Proceed to Donate
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/events">Upcoming Events</Link>
            </Button>
          </div>
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Mission - Content Left, Image Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 max-w-7xl mx-auto">
            <div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">Our Mission</h2>
                <div className="w-20 h-1 bg-accent"></div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To foster a strong, vibrant South Asian community in Greater New Haven by promoting cultural awareness,
                  social engagement, and mutual support.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We strive to create meaningful connections that celebrate our rich heritage while embracing the diversity
                  of our region. Through community programs, cultural events, and social initiatives, we work to build
                  bridges between generations and cultures.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-primary/20 rounded-lg -z-10"></div>
              <Image
                src="/images/about-us.jpg"
                alt="Community members in traditional attire celebrating culture"
                width={600}
                height={338}
                priority
                quality={85}
                className="rounded-lg shadow-2xl w-full object-cover aspect-video transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>



          {/* Our Goal - Logo Left, Content Right with Maroon Background */}
          <div className="bg-gradient-to-br from-[#800020] to-[#600018] text-white rounded-3xl overflow-hidden shadow-2xl max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 items-center">
              {/* Logo Section - Left */}
              <div className="lg:col-span-2 flex items-center justify-center p-8 md:p-12 lg:pl-16">
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
                  <Image
                    src="/images/logo.jpg"
                    alt="SACG Logo"
                    fill
                    className="object-contain drop-shadow-2xl relative z-10"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>

              {/* Content Section - Right */}
              <div className="lg:col-span-3 p-8 md:p-12 lg:pr-16">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-3">Our Goal</h2>
                    <div className="w-24 h-1.5 bg-white/90 rounded-full"></div>
                  </div>

                  <p className="text-lg leading-relaxed opacity-95">
                    To create a thriving, inclusive community where South Asian culture is celebrated, preserved, and shared
                    with future generations while fostering meaningful connections across all backgrounds.
                  </p>

                  <p className="text-base leading-relaxed opacity-90">
                    We aim to empower our members through cultural education, community service, and social engagement,
                    building a legacy of unity, understanding, and mutual respect that enriches the Greater New Haven area
                    for years to come.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <span className="text-white/90 mt-0.5 text-lg">✓</span>
                      <span className="text-sm leading-snug">Strengthen cultural identity and heritage preservation</span>
                    </div>
                    <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <span className="text-white/90 mt-0.5 text-lg">✓</span>
                      <span className="text-sm leading-snug">Foster cross-generational and cross-cultural connections</span>
                    </div>
                    <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <span className="text-white/90 mt-0.5 text-lg">✓</span>
                      <span className="text-sm leading-snug">Support community members through resources and programs</span>
                    </div>
                    <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <span className="text-white/90 mt-0.5 text-lg">✓</span>
                      <span className="text-sm leading-snug">Promote civic engagement and social responsibility</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whatWeDoItems.map((item, index) => (
              <InteractiveCard
                key={index}
                image={item.image}
                title={item.title}
                description={item.description}
                index={index}
                hoveredIndex={hoveredIndex}
                onHover={setHoveredIndex}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">What Our Members Say</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Hear from community members about their experiences with SACG
          </p>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find answers to common questions about SACG and our activities
          </p>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto bg-background rounded-lg shadow-sm">
            <AccordionItem value="item-1" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                What types of events does SACG organize?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                SACG organizes a wide variety of events including cultural festivals like Diwali and Holi celebrations, educational workshops, family gatherings, networking events, and community service initiatives. Check our Events page to see what's coming up!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                Do I need to be South Asian to join SACG?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Absolutely not! While SACG celebrates South Asian culture, we welcome everyone who is interested in learning about and celebrating our traditions. Our community is built on inclusivity and cultural exchange.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                How can I volunteer with SACG?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We're always looking for passionate volunteers! Contact us through our Contact page or email us directly. Volunteer opportunities include event planning, cultural programming, community outreach, and administrative support. Every contribution makes a difference!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="px-6 border-b-0">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                Are SACG events family-friendly?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes! Most of our events are designed to be family-friendly and welcoming to all ages. We often have activities specifically planned for children and families. Check individual event descriptions for specific details about age-appropriateness.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-balance">
            Become part of something bigger. Connect with your community, celebrate your heritage, and make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/members">Become a Member</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
