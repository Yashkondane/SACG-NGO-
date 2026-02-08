'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { MissionSection } from '@/components/home/mission-section'
import { WhatWeDoSection } from '@/components/home/what-we-do-section'
import { HomeUpcomingEvents } from '@/components/home-upcoming-events'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { FAQSection } from '@/components/home/faq-section'
import { JoinCommunitySection } from '@/components/home/join-community-section'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <HeroSection />

      <MissionSection />

      <WhatWeDoSection />

      <HomeUpcomingEvents />

      <TestimonialsSection />

      <FAQSection />

      <JoinCommunitySection />

      <Footer />
    </div>
  )
}
