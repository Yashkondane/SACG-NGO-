import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { MissionSection } from '@/components/home/mission-section'
import { WhatWeDoSection } from '@/components/home/what-we-do-section'
import { HomeUpcomingEvents } from '@/components/home-upcoming-events'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { FAQSection } from '@/components/home/faq-section'
import { JoinCommunitySection } from '@/components/home/join-community-section'
import { getPageContent } from '@/lib/content'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const content = await getPageContent('home')

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <HeroSection content={content?.hero} />
        <MissionSection missionContent={content?.mission} goalContent={content?.goal} />
        <WhatWeDoSection content={content?.what_we_do} />
        <HomeUpcomingEvents />
        <TestimonialsSection content={content?.testimonials} />
        <FAQSection content={content?.faq} />
        <JoinCommunitySection content={content?.join_community} />
      </main>
      <Footer />
    </div>
  )
}
