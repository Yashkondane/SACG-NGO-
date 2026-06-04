'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail } from 'lucide-react'
import { useGlobalSettings } from '@/components/global-settings-provider'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

export function Footer() {
  const globalSettings = useGlobalSettings()
  const footerLinks = globalSettings?.footer?.links || DEFAULT_PAGE_CONTENT['global-settings'].footer.links
  const footerDetails = globalSettings?.details || DEFAULT_PAGE_CONTENT['global-settings'].details

  // Group links by column name
  const columns: Record<string, any[]> = {}
  if (Array.isArray(footerLinks)) {
    footerLinks.forEach(link => {
      if (!columns[link.column_name]) {
        columns[link.column_name] = []
      }
      columns[link.column_name].push(link)
    })
  }

  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-[60px] h-[60px]">
                <Image
                  src={footerDetails.logo_image || "/images/image.png"}
                  alt="SACG Logo"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">SACG</h3>
                <p className="text-sm text-muted-foreground">South Asian Community of Greater New Haven</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              {footerDetails.mission_text || "Building bridges, celebrating culture, and fostering community growth in the Greater New Haven area."}
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              {footerDetails.facebook_url && footerDetails.facebook_url !== '#' && (
                <a href={footerDetails.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {footerDetails.instagram_url && footerDetails.instagram_url !== '#' && (
                <a href={footerDetails.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {footerDetails.email_address && (
                <a href={`mailto:${footerDetails.email_address}`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Columns */}
          {Object.entries(columns).map(([colName, links], idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-4">{colName}</h4>
              <ul className="space-y-2">
                {links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} South Asian Community of Greater New Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
