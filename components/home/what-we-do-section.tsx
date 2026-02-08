'use client'

import { useState } from 'react'
import { InteractiveCard } from '@/components/interactive-card'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'

export function WhatWeDoSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const whatWeDoItems = [
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
            title: 'Social Support',
            description: 'Provide resources and assistance to community members in times of need'
        }
    ]

    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <FadeIn direction="up">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">What We Do</h2>
                </FadeIn>
                <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {whatWeDoItems.map((item, index) => (
                        <StaggerItem key={index}>
                            <InteractiveCard
                                image={item.image}
                                title={item.title}
                                description={item.description}
                                index={index}
                                hoveredIndex={hoveredIndex}
                                onHover={setHoveredIndex}
                            />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}
