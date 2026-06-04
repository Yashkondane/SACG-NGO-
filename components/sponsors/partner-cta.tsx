'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, HeartHandshake } from 'lucide-react'

interface PartnerWithUsCTAProps {
    title?: string
    description?: string
    buttonText?: string
    subject?: string
    modalTitle?: string
    modalDescription?: string
}

export function PartnerWithUsCTA({ 
    title, 
    description,
    buttonText = "Become a Sponsor",
    subject = "Sponsorship Inquiry",
    modalTitle = "Partner With Us",
    modalDescription = "Fill out this form and our partnership team will reach out to discuss how we can collaborate."
}: PartnerWithUsCTAProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        email: '',
        message: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formattedMessage = `Organization: ${formData.organization}\n\n${formData.message}`

            const { error } = await supabase
                .from('contacts')
                .insert([
                    {
                        full_name: formData.name,
                        email: formData.email,
                        subject: subject,
                        message: formattedMessage,
                        status: 'unread'
                    },
                ])

            if (error) throw error

            alert('Thank you for your interest! We will get in touch with you shortly to discuss partnership opportunities.')
            setFormData({ name: '', organization: '', email: '', message: '' })
            setOpen(false)
        } catch (error: any) {
            console.error('Error submitting sponsorship form:', error)
            alert('Error sending message. Please try again or email us directly.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 bg-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-10 pattern-dots"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">{title || "Partner With Us"}</h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                    {description || "Join our mission to celebrate culture and community in Greater New Haven."}
                </p>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="h-14 px-10 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                        >
                            {buttonText}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <HeartHandshake className="w-6 h-6 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl text-center">{modalTitle}</DialogTitle>
                            <DialogDescription className="text-center">
                                {modalDescription}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="organization">Organization / Company *</Label>
                                <Input
                                    id="organization"
                                    required
                                    value={formData.organization}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    placeholder="Acme Corp"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">How would you like to partner? *</Label>
                                <Textarea
                                    id="message"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="We are interested in sponsoring an upcoming cultural event..."
                                    rows={4}
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg mt-2" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                Submit Inquiry
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}
