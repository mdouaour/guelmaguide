'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const links = [
  { href: '/discover', label: { en: 'Discover', ar: 'اكتشف' } },
  { href: '/activities', label: { en: 'Activities', ar: 'الأنشطة' } },
  { href: '/ai', label: { en: 'AI Guide', ar: 'الدليل الذكي' } },
]

export default function Navbar() {
  const { lang, setLanguage } = useLanguage()
  const { user, logout, isAuthLoading } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <MapPin className="h-4 w-4 text-emerald-700" />
          <span>GuelmaGuide</span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2 py-1 hover:bg-emerald-50 hover:text-slate-900">
              {link.label[lang]}
            </Link>
          ))}
          {!isAuthLoading ? (
            user ? (
              <button onClick={logout} className="rounded-md border border-slate-200 px-2 py-1 hover:border-emerald-400">
                {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            ) : (
              <Link href="/" className="rounded-md border border-slate-200 px-2 py-1 hover:border-emerald-400">
                {lang === 'ar' ? 'دخول' : 'Login'}
              </Link>
            )
          ) : null}
          <div className="ml-1 flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-full px-2 py-1 ${lang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`rounded-full px-2 py-1 ${lang === 'ar' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
            >
              AR
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
