import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Preloader } from '@/components/preloader'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SACG - South Asian Community of Greater New Haven',
  description: 'Building bridges, celebrating culture, and fostering community growth in the Greater New Haven area.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Preloader />
        {children}
      </body>
    </html>
  )
}
