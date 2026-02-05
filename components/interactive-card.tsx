'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

interface InteractiveCardProps {
  image: string
  title: string
  description: string
  index: number
  hoveredIndex: number | null
  onHover: (index: number | null) => void
}

export function InteractiveCard({ 
  image, 
  title, 
  description, 
  index, 
  hoveredIndex, 
  onHover 
}: InteractiveCardProps) {
  const isHovered = hoveredIndex === index
  const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-500 ease-out"
      style={{
        transform: isHovered 
          ? 'scale(1.05)' 
          : isOtherHovered 
            ? 'scale(0.95)' 
            : 'scale(1)',
        opacity: isOtherHovered ? 0.7 : 1,
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          quality={80}
          loading="lazy"
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  )
}
