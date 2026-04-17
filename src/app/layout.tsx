import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'GuelmaGuide | Smart discovery in Guelma',
  description: 'Explore places and activities in Guelma with simple browsing, structured suggestions, and a lightweight AI guide.',
  keywords: ['Guelma', 'Algeria', 'discover places', 'activities', 'AI guide', 'smart city guide'],
  openGraph: {
    title: 'GuelmaGuide | Smart discovery in Guelma',
    description: 'Explore places and activities in Guelma with a lightweight AI guide.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://guelma.guide',
    siteName: 'GuelmaGuide',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
