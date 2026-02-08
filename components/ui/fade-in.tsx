'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    fullWidth?: boolean
}

export function FadeIn({
    children,
    className = '',
    delay = 0,
    duration = 0.5,
    direction = 'up',
    fullWidth = false,
}: FadeInProps) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
            x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration,
                delay,
                ease: 'easeOut',
            },
        },
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={variants}
            className={`${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {children}
        </motion.div>
    )
}
