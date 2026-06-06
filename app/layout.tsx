import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Preloader } from '@/components/preloader'
import { GoogleAnalytics } from '@next/third-parties/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SACG - South Asian Community of Greater New Haven',
  description: 'Building bridges, celebrating culture, and fostering community growth in the Greater New Haven area.',
  icons: {
    icon: '/icon.svg',
  },
  generator: 'v0.app',
}

import { getPageContent } from '@/lib/content'
import { GlobalSettingsProvider } from '@/components/global-settings-provider'

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  const globalSettings = await getPageContent('global-settings')
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <GlobalSettingsProvider settings={globalSettings}>
          <Preloader />
          {children}
          {modal}
        </GlobalSettingsProvider>
        <GoogleAnalytics gaId="G-2ZJ9WFTPPL" />
      </body>
    </html>
  )
}
