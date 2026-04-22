'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>{lang === 'ar' ? 'دليل مدينة ذكي لقالمة، الجزائر.' : 'Smart city guide for Guelma, Algeria.'}</p>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="hover:text-slate-900">{lang === 'ar' ? 'اكتشف' : 'Discover'}</Link>
          <Link href="/activities" className="hover:text-slate-900">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</Link>
          <Link href="/ai" className="hover:text-slate-900">{lang === 'ar' ? 'الدليل الذكي' : 'AI Guide'}</Link>
        </div>
      </div>
    </footer>
  )
}
