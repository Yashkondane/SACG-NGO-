'use client'

import { useState } from 'react'
import { InteractiveCard } from '@/components/interactive-card'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'

interface WhatWeDoSectionProps {
    content?: any
}

export function WhatWeDoSection({ content }: WhatWeDoSectionProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const whatWeDoItems = content?.items || [
        {
            image: '/images/cultural-events.jpg',
            title: 'Cultural Events',
            description: 'Celebrate festivals, traditions, and cultural milestones together through vibrant performances and gatherings'
        },
        {
            image: '/images/community-building.jpg',
            title: 'Community Building',
            description: 'Connect with neighbors and build lasting friendships across generations and backgrounds'
        },
        {
            image: '/images/social-support.jpg',
            title: 'Social Engagement',
            description: 'Fostering a sense of belonging and community participation'
        }
    ]

    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <FadeIn direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
                        {content?.title || "What We Do"}
                    </h2>
                </FadeIn>
                <FadeIn delay={0.2} direction="up" fullWidth>
                    <div className="overflow-hidden w-full relative group py-4">
                        {/* Gradient masks for smooth fading at edges */}
                        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />
                        
                        <div className="flex animate-marquee hover:[animation-play-state:paused] w-max gap-6 px-4">
                            {[...whatWeDoItems, ...whatWeDoItems].map((item: any, index: number) => (
                                <div key={index} className="w-[280px] md:w-[360px] shrink-0">
                                    <InteractiveCard
                                        image={item.image}
                                        title={item.title}
                                        description={item.description}
                                        index={index % whatWeDoItems.length} // Pass original index to InteractiveCard so logic works
                                        hoveredIndex={hoveredIndex}
                                        onHover={setHoveredIndex}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
