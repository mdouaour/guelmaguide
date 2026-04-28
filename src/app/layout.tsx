import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import UnverifiedBanner from '@/components/UnverifiedBanner'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'

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
    // Expected SSR/client mismatch: LanguageProvider updates lang/dir from localStorage/browser preference after hydration.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <UnverifiedBanner />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
