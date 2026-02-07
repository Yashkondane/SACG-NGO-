'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/events', label: 'Events' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/newsletter', label: 'Newsletter' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${(isScrolled || !isHomePage)
        ? 'bg-white shadow-md border-b'
        : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="SACG Logo"
              width={60}
              height={60}
              className="object-contain" // Removed rounded-full to show full logo, added object-contain
            />
            <span className={`font-bold text-xl hidden md:inline transition-colors ${(isScrolled || !isHomePage) ? 'text-foreground' : 'text-white'
              }`}>
              SACG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${(isScrolled || !isHomePage) ? 'text-muted-foreground hover:text-primary' : 'text-white hover:text-primary'}`}>
              Home
            </Link>
            <Link href="/about" className={`text-sm font-medium transition-colors ${(isScrolled || !isHomePage) ? 'text-muted-foreground hover:text-primary' : 'text-white hover:text-primary'}`}>
              About Us
            </Link>

            {/* Events Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${(isScrolled || !isHomePage) ? 'text-muted-foreground hover:text-primary' : 'text-white hover:text-primary'}`}>
                Events
              </button>
              {/* Dropdown Menu with Padding Bridge */}
              <div className="absolute top-full left-0 pt-4 w-48 hidden group-hover:block">
                <div className="bg-white rounded-md shadow-lg py-1 border">
                  <Link href="/events/upcoming" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Upcoming </Link>
                  <Link href="/events/past" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Past Events</Link>
                  <Link href="/events/health" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Health Awareness</Link>
                </div>
              </div>
            </div>

            <Link href="/sponsors" className={`text-sm font-medium transition-colors ${(isScrolled || !isHomePage) ? 'text-muted-foreground hover:text-primary' : 'text-white hover:text-primary'}`}>
              Sponsors
            </Link>
            <Link href="/newsletter" className={`text-sm font-medium transition-colors ${(isScrolled || !isHomePage) ? 'text-muted-foreground hover:text-primary' : 'text-white hover:text-primary'}`}>
              Newsletter
            </Link>

            <Button asChild className="ml-2">
              <a href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven" target="_blank" rel="noopener noreferrer">Donate</a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMounted ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={(isScrolled || !isHomePage) ? '' : 'text-white hover:bg-white/20'}
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2">Home</Link>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2">About Us</Link>

                  <div className="py-2">
                    <div className="text-lg font-medium text-foreground mb-2">Events</div>
                    <div className="pl-4 flex flex-col gap-2">
                      <Link href="/events/upcoming" onClick={() => setIsOpen(false)} className="text-base text-muted-foreground hover:text-primary">Upcoming</Link>
                      <Link href="/events/past" onClick={() => setIsOpen(false)} className="text-base text-muted-foreground hover:text-primary">Past</Link>
                      <Link href="/events/health" onClick={() => setIsOpen(false)} className="text-base text-muted-foreground hover:text-primary">Health Awareness</Link>
                    </div>
                  </div>

                  <Link href="/sponsors" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2">Sponsors</Link>
                  <Link href="/newsletter" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2">Newsletter</Link>

                  <Button asChild className="mt-4">
                    <a href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>Donate</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={(isScrolled || !isHomePage) ? 'md:hidden' : 'text-white hover:bg-white/20 md:hidden'}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
