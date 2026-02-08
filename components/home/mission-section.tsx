'use client'

import Image from 'next/image'
import { FadeIn } from '@/components/ui/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-container'

export function MissionSection() {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Mission - Content Left, Image Right */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 max-w-7xl mx-auto">
                    <div>
                        <div className="space-y-6">
                            <FadeIn direction="right">
                                <h2 className="text-4xl md:text-5xl font-bold text-primary">Our Mission</h2>
                                <div className="w-20 h-1 bg-accent mt-2"></div>
                            </FadeIn>
                            <FadeIn delay={0.2} direction="right">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    To foster a strong, vibrant South Asian community in Greater New Haven by promoting cultural awareness,
                                    social engagement, and mutual support.
                                </p>
                            </FadeIn>
                            <FadeIn delay={0.4} direction="right">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    We strive to create meaningful connections that celebrate our rich heritage while embracing the diversity
                                    of our region. Through community programs, cultural events, and social initiatives, we work to build
                                    bridges between generations and cultures.
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                    <div className="relative">
                        <FadeIn direction="left" delay={0.3}>
                            <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-primary/20 rounded-lg -z-10"></div>
                            <Image
                                src="/images/about-us.jpg"
                                alt="Community members in traditional attire celebrating culture"
                                width={600}
                                height={338}
                                priority
                                quality={85}
                                className="rounded-lg shadow-2xl w-full object-cover aspect-video transition-transform duration-500 hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </FadeIn>
                    </div>
                </div>

                {/* Our Goal - Logo Left, Content Right with Maroon Background */}
                <FadeIn delay={0.2} direction="up" fullWidth>
                    <div className="bg-primary text-primary-foreground py-20 -mx-4 px-4 sm:px-8 md:px-16 relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 items-center relative z-10">
                            {/* Logo Section - Left */}
                            <div className="lg:col-span-2 flex items-center justify-center">
                                <div className="relative w-full max-w-sm aspect-square">
                                    <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                                    <Image
                                        src="/images/logo.jpg"
                                        alt="SACG Logo"
                                        fill
                                        className="object-contain drop-shadow-2xl relative z-10 rounded-full bg-white p-2 hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                    />
                                </div>
                            </div>

                            {/* Content Section - Right */}
                            <div className="lg:col-span-3">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-bold mb-3">Our Goal</h2>
                                        <div className="w-24 h-1.5 bg-white/90 rounded-full"></div>
                                    </div>

                                    <p className="text-lg leading-relaxed opacity-95 text-balance">
                                        To create a thriving, inclusive community where South Asian culture is celebrated, preserved, and shared
                                        with future generations while fostering meaningful connections across all backgrounds.
                                    </p>

                                    <p className="text-base leading-relaxed opacity-90 text-balance">
                                        We aim to empower our members through cultural education, community service, and social engagement,
                                        building a legacy of unity, understanding, and mutual respect that enriches the Greater New Haven area
                                        for years to come.
                                    </p>

                                    <StaggerContainer className="grid sm:grid-cols-2 gap-3 pt-2" delay={0.4}>
                                        <StaggerItem className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                            <span className="text-white/90 mt-0.5 text-lg">✓</span>
                                            <span className="text-sm leading-snug">Strengthen cultural identity and heritage preservation</span>
                                        </StaggerItem>
                                        <StaggerItem className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                            <span className="text-white/90 mt-0.5 text-lg">✓</span>
                                            <span className="text-sm leading-snug">Foster cross-generational and cross-cultural connections</span>
                                        </StaggerItem>
                                        <StaggerItem className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                            <span className="text-white/90 mt-0.5 text-lg">✓</span>
                                            <span className="text-sm leading-snug">Support community members through resources and programs</span>
                                        </StaggerItem>
                                        <StaggerItem className="flex items-start gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                            <span className="text-white/90 mt-0.5 text-lg">✓</span>
                                            <span className="text-sm leading-snug">Promote civic engagement and social responsibility</span>
                                        </StaggerItem>
                                    </StaggerContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
