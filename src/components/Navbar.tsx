'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const links = [
  { href: '/discover', label: { en: 'Discover', ar: 'اكتشف' } },
  { href: '/activities', label: { en: 'Activities', ar: 'الأنشطة' } },
  { href: '/ai', label: { en: 'AI Guide', ar: 'الدليل الذكي' } },
]

export default function Navbar() {
  const { lang, setLanguage } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0F]/95 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MapPin className="h-4 w-4 text-yellow-400" />
          <span>GuelmaGuide</span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-white/80">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2 py-1 hover:bg-white/5 hover:text-white">
              {link.label[lang]}
            </Link>
          ))}
          <div className="ml-1 flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-full px-2 py-1 ${lang === 'en' ? 'bg-yellow-500 text-black' : 'text-white/70'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`rounded-full px-2 py-1 ${lang === 'ar' ? 'bg-yellow-500 text-black' : 'text-white/70'}`}
            >
              AR
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
