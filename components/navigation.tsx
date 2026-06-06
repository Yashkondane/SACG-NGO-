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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SupportDialogContent } from '@/components/support-dialog-content'

import { useGlobalSettings } from '@/components/global-settings-provider'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

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

  const globalSettings = useGlobalSettings()
  const headerLinks = globalSettings?.header?.links || DEFAULT_PAGE_CONTENT['global-settings'].header.links
  const logoImage = globalSettings?.details?.logo_image || DEFAULT_PAGE_CONTENT['global-settings'].details.logo_image
  
  const navItems: any[] = [];
  if (Array.isArray(headerLinks)) {
    headerLinks.forEach(link => {
      if (link.parent_dropdown) {
        const existing = navItems.find(i => i.isDropdown && i.label === link.parent_dropdown);
        if (existing) {
          existing.children.push(link);
        } else {
          navItems.push({ isDropdown: true, label: link.parent_dropdown, children: [link] });
        }
      } else {
        navItems.push({ isDropdown: false, label: link.label, href: link.href });
      }
    });
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${(isScrolled || !isHomePage)
        ? 'bg-primary shadow-md'
        : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-[60px] h-[60px]">
              <Image
                src={logoImage}
                alt="SACG Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl hidden md:inline transition-colors text-white">
              SACG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, idx) => {
              if (item.isDropdown) {
                return (
                  <div key={idx} className="relative group h-full flex items-center">
                    <button className="flex items-center gap-1 text-sm font-medium transition-colors text-white hover:text-white/80">
                      {item.label}
                    </button>
                    <div className="absolute top-full left-0 pt-4 min-w-[200px] hidden group-hover:block">
                      <div className="bg-white rounded-md shadow-lg py-1 border">
                        {item.children.map((child: any, cIdx: number) => (
                          <Link key={cIdx} href={child.href} className="block px-4 py-2 text-sm text-primary hover:bg-gray-100 whitespace-nowrap">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <Link key={idx} href={item.href} className="text-sm font-medium transition-colors text-white hover:text-white/80">
                  {item.label}
                </Link>
              )
            })}

            <Button asChild className="ml-2 bg-white text-primary hover:bg-white/90">
              <Link href="/donation">Donate</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMounted ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <div className="flex flex-col gap-2 mt-8 pb-8">
                  <Accordion type="multiple" className="w-full">
                    {navItems.map((item, idx) => {
                      if (item.isDropdown) {
                        return (
                          <AccordionItem value={`item-${idx}`} key={idx} className="border-b-0">
                            <AccordionTrigger className="text-lg font-medium text-muted-foreground hover:text-primary py-2 hover:no-underline">
                              {item.label}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col gap-3 pl-4 pt-1">
                                {item.children.map((child: any, cIdx: number) => (
                                  <Link key={cIdx} href={child.href} onClick={() => setIsOpen(false)} className="text-base text-muted-foreground hover:text-primary block w-full">
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      }
                      return (
                        <div key={idx} className="py-2">
                          <Link href={item.href} onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors block w-full text-left">
                            {item.label}
                          </Link>
                        </div>
                      )
                    })}
                  </Accordion>

                  <Button asChild className="mt-4 w-full" onClick={() => setIsOpen(false)}>
                    <Link href="/donation">Donate</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 md:hidden"
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
