import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, Search } from 'lucide-react'

const members = [
  {
    name: 'Amit Banerjee',
    role: 'Community Member',
    location: 'New Haven, CT',
    email: 'amit.b@example.com',
    phone: '(203) 555-0101',
    initials: 'AB',
  },
  {
    name: 'Deepa Chatterjee',
    role: 'Event Volunteer',
    location: 'West Haven, CT',
    email: 'deepa.c@example.com',
    phone: '(203) 555-0102',
    initials: 'DC',
  },
  {
    name: 'Kiran Desai',
    role: 'Youth Program Coordinator',
    location: 'East Haven, CT',
    email: 'kiran.d@example.com',
    phone: '(203) 555-0103',
    initials: 'KD',
  },
  {
    name: 'Neha Gupta',
    role: 'Community Member',
    location: 'Hamden, CT',
    email: 'neha.g@example.com',
    phone: '(203) 555-0104',
    initials: 'NG',
  },
  {
    name: 'Rahul Iyer',
    role: 'Cultural Committee',
    location: 'New Haven, CT',
    email: 'rahul.i@example.com',
    phone: '(203) 555-0105',
    initials: 'RI',
  },
  {
    name: 'Sanjana Kapoor',
    role: 'Community Member',
    location: 'Branford, CT',
    email: 'sanjana.k@example.com',
    phone: '(203) 555-0106',
    initials: 'SK',
  },
  {
    name: 'Tarun Malhotra',
    role: 'Event Volunteer',
    location: 'Milford, CT',
    email: 'tarun.m@example.com',
    phone: '(203) 555-0107',
    initials: 'TM',
  },
  {
    name: 'Uma Nair',
    role: 'Outreach Coordinator',
    location: 'New Haven, CT',
    email: 'uma.n@example.com',
    phone: '(203) 555-0108',
    initials: 'UN',
  },
  {
    name: 'Vivek Patel',
    role: 'Community Member',
    location: 'Orange, CT',
    email: 'vivek.p@example.com',
    phone: '(203) 555-0109',
    initials: 'VP',
  },
  {
    name: 'Zara Rahman',
    role: 'Youth Mentor',
    location: 'New Haven, CT',
    email: 'zara.r@example.com',
    phone: '(203) 555-0110',
    initials: 'ZR',
  },
  {
    name: 'Arjun Sharma',
    role: 'Community Member',
    location: 'West Haven, CT',
    email: 'arjun.s@example.com',
    phone: '(203) 555-0111',
    initials: 'AS',
  },
  {
    name: 'Priya Verma',
    role: 'Education Committee',
    location: 'New Haven, CT',
    email: 'priya.v@example.com',
    phone: '(203) 555-0112',
    initials: 'PV',
  },
]

export default function MembersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Our Community</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Member Directory</h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                Connect with fellow SACG members across the Greater New Haven area and build lasting relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 bg-background sticky top-16 z-10 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members by name, location, or role..."
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Members Grid */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {members.map((member) => (
                <Card key={member.email} className="border-2 hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <Avatar className="h-16 w-16 group-hover:scale-110 transition-transform">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.location}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <a 
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 group-hover/link:bg-primary group-hover/link:text-white flex items-center justify-center transition-all">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="truncate font-medium">{member.email}</span>
                      </a>
                      <a 
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 group-hover/link:bg-primary group-hover/link:text-white flex items-center justify-center transition-all">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{member.phone}</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto text-center border-2 shadow-xl">
              <CardHeader className="pt-12">
                <CardTitle className="text-3xl md:text-4xl mb-4 text-balance">Want to Join Our Directory?</CardTitle>
              </CardHeader>
              <CardContent className="pb-12">
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                  Become a SACG member and connect with our vibrant community. Members enjoy exclusive access to events, 
                  networking opportunities, and community resources.
                </p>
                <Button size="lg" asChild>
                  <a href="/contact">Apply for Membership</a>
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
