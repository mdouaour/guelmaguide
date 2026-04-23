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
    <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-[#FAF7F2]/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <MapPin className="h-4 w-4 text-[#2E7D32]" />
          <span>GuelmaGuide 🌿</span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2 hover:bg-[#eaf6ef] hover:text-slate-900">
              {link.label[lang]}
            </Link>
          ))}
          {!isAuthLoading ? (
            user ? (
              <button onClick={logout} className="rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
                {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            ) : (
              <Link href="/" className="rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
                {lang === 'ar' ? 'دخول' : 'Login'}
              </Link>
            )
          ) : null}
          <div className="ml-1 flex items-center gap-1 rounded-full border border-emerald-200 bg-white p-1 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-full px-3 py-1.5 ${lang === 'en' ? 'bg-[#2E7D32] text-white' : 'text-slate-600'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`rounded-full px-3 py-1.5 ${lang === 'ar' ? 'bg-[#2E7D32] text-white' : 'text-slate-600'}`}
            >
              AR
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
