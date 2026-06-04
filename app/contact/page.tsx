import React from "react"
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { getPageContent } from '@/lib/content'
import { ContactFormClient } from './contact-client'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function ContactPage() {
  const content = await getPageContent('contact')
  const header = content?.header || {}
  const details = content?.details || {}

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <ContactFormClient header={header} details={details} />
      </main>
      <Footer />
    </div>
  )
}
