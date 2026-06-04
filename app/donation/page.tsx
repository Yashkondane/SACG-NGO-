import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Users, Calendar, BookOpen, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const donationTiers = [
  {
    name: 'Friend',
    amount: '$25',
    benefits: [
      'SACG Newsletter subscription',
      'Recognition on our website',
      'Event updates',
    ],
  },
  {
    name: 'Supporter',
    amount: '$100',
    benefits: [
      'All Friend benefits',
      '10% discount on event tickets',
      'Invitation to donor appreciation events',
      'SACG membership card',
    ],
  },
  {
    name: 'Patron',
    amount: '$250',
    benefits: [
      'All Supporter benefits',
      '20% discount on event tickets',
      'Priority event registration',
      'Special recognition at annual gala',
    ],
  },
  {
    name: 'Benefactor',
    amount: '$500+',
    benefits: [
      'All Patron benefits',
      'VIP seating at major events',
      'Personal thank you from leadership',
      'Opportunity to sponsor specific programs',
    ],
  },
]

const impactAreas = [
  {
    icon: Calendar,
    title: 'Cultural Events',
    description: 'Support our festivals, celebrations, and cultural programs that bring the community together.',
  },
  {
    icon: BookOpen,
    title: 'Educational Programs',
    description: 'Fund workshops, classes, and educational initiatives that preserve our heritage.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Help us provide resources and assistance to community members in need.',
  },
  {
    icon: Heart,
    title: 'Youth Programs',
    description: 'Enable programs that engage and inspire the next generation of community leaders.',
  },
]

export default function DonatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Support Our Mission</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-balance">
              Your generous contribution helps us build a stronger, more vibrant South Asian community in Greater New Haven.
            </p>
          </div>
        </section>

        {/* Mock Notice */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This is a demonstration page. In production, this would integrate with a payment processor like Stripe, PayPal, or a similar service.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Where Your Donation Goes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {impactAreas.map((area) => (
                <Card key={area.title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <area.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{area.title}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Tiers */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Donation Levels</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {donationTiers.map((tier) => (
                <Card key={tier.name} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary mt-4">{tier.amount}</div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {tier.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full">
                      <a href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven" target="_blank" rel="noopener noreferrer">Select This Level</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Amount */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Make a Custom Donation</CardTitle>
                <CardDescription className="text-base">
                  Every contribution, no matter the size, makes a meaningful difference in our community.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Choose your own amount and help us continue our mission of building bridges and celebrating culture.
                </p>
                <Button asChild size="lg" className="text-lg">
                  <a href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven" target="_blank" rel="noopener noreferrer">Donate Custom Amount</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Other Ways to Give */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Other Ways to Give</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Corporate Sponsorship</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Partner with SACG through corporate sponsorship opportunities. Contact us to learn about benefits and visibility options.
                  </p>
                  <Button variant="outline">Learn More</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Your Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your time and skills are valuable! Join our team of volunteers who help organize events and support community initiatives.
                  </p>
                  <Button variant="outline">Volunteer</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
