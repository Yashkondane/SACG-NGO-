'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { FadeIn } from '@/components/ui/fade-in'

interface FAQSectionProps {
    content?: any
}

export function FAQSection({ content }: FAQSectionProps) {
    const defaultItems = [
        {
            question: "What types of events does SACG organize?",
            answer: "SACG organizes a wide variety of events including cultural festivals like Diwali and Holi celebrations, educational workshops, family gatherings, networking events, and community service initiatives. Check our Events page to see what's coming up!"
        },
        {
            question: "Do I need to be South Asian to join SACG?",
            answer: "Absolutely not! While SACG celebrates South Asian culture, we welcome everyone who is interested in learning about and celebrating our traditions. Our community is built on inclusivity and cultural exchange."
        },
        {
            question: "How can I volunteer with SACG?",
            answer: "We're always looking for passionate volunteers! Contact us through our Contact page or email us directly. Volunteer opportunities include event planning, cultural programming, community outreach, and administrative support. Every contribution makes a difference!"
        },
        {
            question: "Are SACG events family-friendly?",
            answer: "Yes! Most of our events are designed to be family-friendly and welcoming to all ages. We often have activities specifically planned for children and families. Check individual event descriptions for specific details about age-appropriateness."
        }
    ]

    const items = content?.items || defaultItems

    return (
        <section className="py-24 bg-muted/50">
            <div className="container mx-auto px-4">
                <FadeIn direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">{content?.title || "Frequently Asked Questions"}</h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        {content?.subtitle || "Find answers to common questions about SACG and our activities"}
                    </p>
                </FadeIn>

                <FadeIn delay={0.2} direction="up">
                    <Accordion type="single" collapsible className="max-w-3xl mx-auto bg-background rounded-lg shadow-sm border p-2">
                        {items.map((item: any, index: number) => (
                            <AccordionItem key={index} value={`item-${index + 1}`} className={`px-6 ${index === items.length - 1 ? 'border-b-0' : ''}`}>
                                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </FadeIn>
            </div>
        </section>
    )
}
