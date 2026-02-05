'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 150)

    // Wait for images and content to load
    const handleLoad = () => {
      // Give a small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="text-center space-y-6">
            {/* Logo or Brand Name */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <img
                src="/images/logo.jpg"
                alt="SACG Logo"
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </motion.div>

            {/* Loading Spinner */}
            <div className="relative w-20 h-20 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
              />
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-primary rounded-full"
              />
            </div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              Loading... {progress}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
