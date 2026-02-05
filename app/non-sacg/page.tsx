import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Users, Calendar, Info } from 'lucide-react'

const organizations = [
  {
    name: 'South Asian Bar Association',
    description: 'Professional networking and advocacy for South Asian legal professionals in Connecticut.',
    website: 'https://example.com',
    contact: 'info@saba-ct.org',
  },
  {
    name: 'Indian American Forum',
    description: 'Cultural and educational programs promoting understanding of Indian-American heritage.',
    website: 'https://example.com',
    contact: 'contact@iaforum.org',
  },
  {
    name: 'Bengali Association of New England',
    description: 'Fostering Bengali culture and traditions in the New England region.',
    website: 'https://example.com',
    contact: 'contact@bane.org',
  },
  {
    name: 'Sri Lankan Community Center',
    description: 'Promoting Sri Lankan culture and heritage through community events and cultural programs.',
    website: 'https://example.com',
    contact: 'info@slcc.org',
  },
]

export default function NonSACGPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Community Partners</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Partner Organizations</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Connecting you with other South Asian organizations and community groups in the Greater New Haven area and beyond.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">About This Directory</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  While SACG focuses on serving the South Asian community in Greater New Haven, we recognize the value of connecting 
                  with other organizations that share similar missions. This directory lists partner organizations and related groups 
                  that you might find helpful for networking, cultural engagement, and community support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Organizations List */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Our Partner Network</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Connect with these amazing organizations serving the South Asian community
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {organizations.map((org) => (
                <Card key={org.name} className="border-2 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{org.name}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{org.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <a 
                        href={org.website}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 group-hover/link:bg-primary group-hover/link:text-white flex items-center justify-center transition-all">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Visit Website</span>
                      </a>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{org.contact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Collaboration */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto text-center border-2 shadow-xl">
              <CardContent className="pt-12 pb-12">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Interested in Collaboration?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  If your organization would like to partner with SACG for events, programs, or community initiatives, 
                  we'd love to hear from you.
                </p>
                <Button size="lg" asChild>
                  <a href="/contact">Get in Touch</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
