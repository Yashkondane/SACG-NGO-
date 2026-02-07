import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, FileText } from 'lucide-react'
import Image from 'next/image'

export default function NewsletterPage() {
  const driveLink = "https://drive.google.com/file/d/1ZA5_E7RaNAMCfhdulszgoIJ1DJKGECJy/view?usp=drivesdk"

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Issue 001: Dec 2025</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">SACG Gupshup</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8">
                Stay connected with our community through our newsletter featuring events, updates, and stories from the South Asian Community of Greater New Haven.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                asChild
              >
                <a href={driveLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  View Full Newsletter on Google Drive
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Display */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Latest Newsletter</h2>
                <p className="text-muted-foreground">Click on the pages below to view the full newsletter</p>
              </div>

              {/* Newsletter Pages */}
              <div className="space-y-8">
                {/* Page 1 */}
                <a
                  href={driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="relative w-full bg-white shadow-2xl rounded-lg overflow-hidden hover:shadow-3xl transition-all duration-300 group-hover:scale-[1.02]">
                    <Image
                      src="/images/newsletter-page1.jpg"
                      alt="SACG Newsletter - Page 1"
                      width={1200}
                      height={1554}
                      className="w-full h-auto"
                      priority
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-4 shadow-lg">
                        <ExternalLink className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </a>

                {/* Page 2 */}
                <a
                  href={driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="relative w-full bg-white shadow-2xl rounded-lg overflow-hidden hover:shadow-3xl transition-all duration-300 group-hover:scale-[1.02]">
                    <Image
                      src="/images/newsletter-page2.jpg"
                      alt="SACG Newsletter - Page 2"
                      width={1200}
                      height={1554}
                      className="w-full h-auto"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-4 shadow-lg">
                        <ExternalLink className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
