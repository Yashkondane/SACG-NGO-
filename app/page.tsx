'use client'

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
import { useState } from 'react'

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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
        <Image
          src="/images/hero.jpg"
          alt="SACG community gathering"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Building Bridges, Celebrating Culture
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance">
            The South Asian Community of Greater New Haven brings together diverse voices to create a vibrant, inclusive community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <a href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven" target="_blank" rel="noopener noreferrer">Support Our Mission</a>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/events">Upcoming Events</Link>
            </Button>
          </div>
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
                src="/images/mission.jpg"
                alt="Community members in traditional attire celebrating culture"
                width={600}
                height={338}
                priority
                quality={85}
                className="rounded-lg shadow-2xl w-full object-cover aspect-video"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Vision - Image Left, Content Right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -bottom-4 -left-4 w-full h-full border-4 border-primary/20 rounded-lg -z-10"></div>
              <Image
                src="/images/vision.jpg"
                alt="Community members celebrating diversity and unity"
                width={600}
                height={338}
                priority
                quality={85}
                className="rounded-lg shadow-2xl w-full object-cover aspect-video"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">Our Vision</h2>
                <div className="w-20 h-1 bg-accent"></div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To be a leading voice in fostering cultural understanding and community development, creating a welcoming
                  space where South Asian traditions thrive alongside contemporary values.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We envision a future where our community serves as a bridge between cultures and generations, where every
                  member feels valued, connected, and empowered to contribute to the rich tapestry of Greater New Haven.
                </p>
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
            Find answers to common questions about SACG membership and activities
          </p>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto bg-background rounded-lg shadow-sm">
            <AccordionItem value="item-1" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                How do I become a member of SACG?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Becoming a member is easy! Simply visit our Members page and fill out the membership form. You can choose between individual and family membership options. Once submitted, our team will reach out to you with payment details and welcome materials.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                What types of events does SACG organize?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                SACG organizes a wide variety of events including cultural festivals like Diwali and Holi celebrations, educational workshops, family gatherings, networking events, and community service initiatives. Check our Events page to see what's coming up!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                Do I need to be South Asian to join SACG?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Absolutely not! While SACG celebrates South Asian culture, we welcome everyone who is interested in learning about and celebrating our traditions. Our community is built on inclusivity and cultural exchange.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                How can I volunteer with SACG?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We're always looking for passionate volunteers! Contact us through our Contact page or email us directly. Volunteer opportunities include event planning, cultural programming, community outreach, and administrative support. Every contribution makes a difference!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                What are the membership fees?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We offer flexible membership options to suit different needs. Individual membership is $50 per year, and family membership (up to 4 members) is $100 per year. Student memberships are available at a discounted rate of $25 per year. All fees go directly toward organizing community events and programs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="px-6 border-b-0">
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
