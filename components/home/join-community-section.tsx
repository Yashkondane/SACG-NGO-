'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/ui/fade-in'

export function JoinCommunitySection() {
    return (
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <FadeIn direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Join Our Community</h2>
                </FadeIn>
                <FadeIn delay={0.2} direction="up">
                    <p className="text-lg mb-8 max-w-2xl mx-auto text-balance opacity-90">
                        Become part of something bigger. Connect with your community, celebrate your heritage, and make a difference.
                    </p>
                </FadeIn>
                <FadeIn delay={0.3} direction="up">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" variant="outline" className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105">
                            <Link href="/contact">Get in Touch</Link>
                        </Button>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
