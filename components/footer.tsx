import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.jpg"
                alt="SACG Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h3 className="font-bold text-lg">SACG</h3>
                <p className="text-sm text-muted-foreground">South Asian Community of Greater New Haven</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Building bridges, celebrating culture, and fostering community growth in the Greater New Haven area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/newsletter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Newsletter
                </Link>
              </li>
              <li>
                <a href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Donate
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="mailto:info@sacg.org" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} South Asian Community of Greater New Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
