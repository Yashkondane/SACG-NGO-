'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { SupportDialogContent } from '@/components/support-dialog-content'
import { FadeIn } from '@/components/ui/fade-in'

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
            {/* Slider Images */}
            <div className="absolute inset-0 w-full h-full">
                {[
                    '/images/hero.jpg',
                    '/images/sacg-banner.png'
                ].map((src, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={src}
                            alt={`SACG Slide ${index + 1}`}
                            fill
                            priority={index === 0}
                            quality={90}
                            className="object-cover"
                            sizes="100vw"
                        />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/50" />
                    </div>
                ))}
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white pt-20">
                <FadeIn delay={0.2} direction="up">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance drop-shadow-lg">
                        Building Bridges, Celebrating Culture
                    </h1>
                </FadeIn>
                <FadeIn delay={0.4} direction="up">
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance drop-shadow-md">
                        The South Asian Community of Greater New Haven brings together diverse voices to create a vibrant, inclusive community
                    </p>
                </FadeIn>
                <FadeIn delay={0.6} direction="up">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg" className="text-lg gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                    Support Our Mission
                                </Button>
                            </DialogTrigger>
                            <SupportDialogContent />
                        </Dialog>

                        <Button asChild size="lg" variant="secondary" className="text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            <Link href="/events">Upcoming Events</Link>
                        </Button>
                    </div>
                </FadeIn>
            </div>

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                {[0, 1].map((index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
