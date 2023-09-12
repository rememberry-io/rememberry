// UI shared between routes

import './globals.css'
import type { Metadata } from 'next'
// self-host google font, served from deployment domain, not per request
import { Manrope } from 'next/font/google'

// only consider or include the Latin subset of characters
const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'rememberry',
  description: 'rememberry',
}

// top-most layout, defines globally shared UI

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  )
}
