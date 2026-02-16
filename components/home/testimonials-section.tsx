'use client'

import { TestimonialsCarousel } from '@/components/testimonials-carousel'
import { FadeIn } from '@/components/ui/fade-in'

interface TestimonialsSectionProps {
    content?: any
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <FadeIn direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">{content?.title || "What Our Members Say"}</h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        {content?.subtitle || "Hear from community members about their experiences with SACG"}
                    </p>
                </FadeIn>
                <FadeIn delay={0.2} direction="up">
                    <TestimonialsCarousel items={content?.testimonials} />
                </FadeIn>
            </div>
        </section>
    )
}
