'use client'

import { useEffect, useState, useMemo } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Search, Briefcase, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { MembershipForm } from '@/components/membership-form'
import { groupBy } from 'lodash'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Member = {
  id: string
  full_name: string
  profession: string
  location: string
  email: string
  status: string
  created_at: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfession, setSelectedProfession] = useState('all')

  // State for Contact Member Dialog
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedMemberName, setSelectedMemberName] = useState('')

  // Fetch approved members
  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('status', 'approved')
          .order('full_name', { ascending: true })

        if (error) throw error
        setMembers(data || [])
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  // Derived state for filtering
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch =
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.profession.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesProfession = selectedProfession === 'all' || member.profession === selectedProfession

      return matchesSearch && matchesProfession
    })
  }, [members, searchTerm, selectedProfession])

  // Get unique professions for filter dropdown
  const professions = useMemo(() => {
    const unique = Array.from(new Set(members.map(m => m.profession))).sort()
    return ['all', ...unique]
  }, [members])

  // Group by first letter
  const groupedMembers = useMemo(() => {
    return groupBy(filteredMembers, (member) => member.full_name[0].toUpperCase())
  }, [filteredMembers])

  const sortedKeys = Object.keys(groupedMembers).sort()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleContactClick = (memberName: string) => {
    setSelectedMemberName(memberName)
    setContactDialogOpen(true)
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
              <FadeIn direction="up">
                <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">Our Community</Badge>
              </FadeIn>
              <FadeIn delay={0.2} direction="up">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Member Directory</h1>
              </FadeIn>
              <FadeIn delay={0.4} direction="up">
                <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                  Connect with fellow SACG members across the Greater New Haven area.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 bg-background sticky top-16 z-10 border-b shadow-sm">
          <div className="container mx-auto px-4">
            <FadeIn direction="down" duration={0.3}>
              <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, profession, or location..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Professions</SelectItem>
                      {professions.map(prof => (
                        prof !== 'all' && <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Members List */}
        <section className="py-16 bg-muted min-h-[500px]">
          <div className="container mx-auto px-4 max-w-6xl">
            {loading ? (
              <div className="text-center py-20 text-muted-foreground">Loading directory...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No members found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedProfession('all') }}>Clear filters</Button>
              </div>
            ) : (
              <div className="space-y-12">
                {sortedKeys.map(letter => (
                  <div key={letter} id={`group-${letter}`}>
                    <FadeIn direction="up" offset={20}>
                      <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-2">{letter}</h2>
                    </FadeIn>
                    <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedMembers[letter].map((member) => (
                        <StaggerItem key={member.id}>
                          <Card className="border hover:shadow-lg transition-all duration-300 h-full">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                  {getInitials(member.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="overflow-hidden">
                                <CardTitle className="text-base truncate">{member.full_name}</CardTitle>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Briefcase className="w-3 h-3 mr-1" />
                                  <span className="truncate">{member.profession}</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                                  <span>{member.location}</span>
                                </div>
                                <div className="pt-4 mt-4 border-t flex justify-center">
                                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleContactClick(member.full_name)}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Member
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <FadeIn direction="up">
              <Card className="max-w-3xl mx-auto text-center border-2 shadow-xl">
                <CardHeader className="pt-12">
                  <CardTitle className="text-3xl md:text-4xl mb-4 text-balance">Want to Join Our Directory?</CardTitle>
                </CardHeader>
                <CardContent className="pb-12">
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                    Become a SACG member to access exclusive events and connect with our community.
                  </p>
                  <div className="flex justify-center">
                    <MembershipForm />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />

      {/* Helper Dialog for Contact Info */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacting {selectedMemberName}</DialogTitle>
            <DialogDescription>
              To protect member privacy, direct contact details are not listed publicly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-foreground">
              Please contact the SACG administration to facilitate this connection. You can reach out via our contact form or call us, and we will forward your query to {selectedMemberName}.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <a href="/contact">Go to Contact Form</a>
              </Button>
              {/* Replace this with actual phone/email if known, otherwise generic message remains safe */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

