'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Community Member',
    content: 'SACG has become like a second family to us. The cultural events and community gatherings have helped us stay connected to our roots while building new friendships in New Haven.',
    image: '/images/logo.jpg'
  },
  {
    name: 'Raj Patel',
    role: 'Volunteer',
    content: 'Being part of SACG has given me the opportunity to give back to the community and connect with amazing people. The organization does incredible work bringing everyone together.',
    image: '/images/logo.jpg'
  },
  {
    name: 'Anita Kumar',
    role: 'Board Member',
    content: 'What I love most about SACG is how it celebrates our diversity while creating a strong sense of unity. Every event is a beautiful reminder of our shared heritage and values.',
    image: '/images/logo.jpg'
  },
  {
    name: 'Vikram Reddy',
    role: 'Member Since 2018',
    content: 'SACG has been instrumental in helping our family feel at home in New Haven. The support network and cultural programs are invaluable for both adults and children.',
    image: '/images/logo.jpg'
  }
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="border-2 transition-all duration-300 hover:shadow-2xl group hover:bg-primary">
        <CardContent className="p-8 md:p-12">
          <Quote className="h-12 w-12 text-primary/20 mb-6 group-hover:text-white/40 transition-colors" />
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 italic group-hover:text-white transition-colors">
            {testimonials[currentIndex].content}
          </p>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <span className="text-primary font-bold text-lg group-hover:text-white transition-colors">
                {testimonials[currentIndex].name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-bold text-foreground group-hover:text-white transition-colors">{testimonials[currentIndex].name}</p>
              <p className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors">{testimonials[currentIndex].role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prevTestimonial}
          className="rounded-full bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-primary/20'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextTestimonial}
          className="rounded-full bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
