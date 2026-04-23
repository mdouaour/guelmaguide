'use client'

import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Search, UserCircle } from 'lucide-react'
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
  const router = useRouter()
  const [search, setSearch] = useState('')

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = search.trim()
    if (!keyword) {
      router.push('/discover')
      return
    }
    router.push(`/discover?keyword=${encodeURIComponent(keyword)}`)
    setSearch('')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-[#FAF7F2]/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-slate-900">
          <MapPin className="h-4 w-4 text-[#2E7D32]" />
          <span>GuelmaGuide 🌿</span>
        </Link>

        <div className="order-3 flex w-full items-center justify-start gap-1 text-sm text-slate-700 md:order-2 md:w-auto md:flex-1 md:justify-center">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2 hover:bg-[#eaf6ef] hover:text-slate-900">
              {link.label[lang]}
            </Link>
          ))}
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 text-sm text-slate-700 md:order-3">
          <form onSubmit={onSearch} className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-white px-2 py-1.5 sm:flex">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={lang === 'ar' ? 'بحث' : 'Search'}
              className="w-28 bg-transparent text-sm text-slate-900 outline-none md:w-40"
            />
          </form>
          {!isAuthLoading ? (
            user ? (
              <>
                <Link href="/my-activities" className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
                  <UserCircle className="h-4 w-4" />
                  <span>{lang === 'ar' ? 'حسابي' : 'Profile'}</span>
                </Link>
                <button onClick={logout} className="rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
                  {lang === 'ar' ? 'خروج' : 'Logout'}
                </button>
              </>
            ) : (
              <Link href="/auth" className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
                <UserCircle className="h-4 w-4" />
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
