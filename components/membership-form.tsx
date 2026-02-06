'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

export function MembershipForm() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        profession: '',
        location: '',
        bio: '',
        linkedin_url: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('members')
                .insert([
                    {
                        ...formData,
                        status: 'pending', // Explicitly set status to pending
                    },
                ])

            if (error) throw error

            alert('Application submitted successfully! wait for admin approval.')
            setOpen(false)
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                profession: '',
                location: '',
                bio: '',
                linkedin_url: '',
            })
        } catch (error: any) {
            console.error('Error submitting application:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg">Apply for Membership</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Apply for SACG Membership</DialogTitle>
                    <DialogDescription>
                        Join our community! Fill out the details below. Your application will be reviewed by an admin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name *</Label>
                            <Input
                                id="full_name"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(203) 555-0123"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profession">Profession *</Label>
                            <Input
                                id="profession"
                                required
                                value={formData.profession}
                                onChange={handleChange}
                                placeholder="Software Engineer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location (City, State) *</Label>
                        <Input
                            id="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="New Haven, CT"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="linkedin_url">LinkedIn URL (Optional)</Label>
                        <Input
                            id="linkedin_url"
                            type="url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/johndoe"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Short Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us a little about yourself..."
                            rows={3}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
