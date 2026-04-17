'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="border-t border-white/10 bg-[#07070B]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>{lang === 'ar' ? 'دليل مدينة ذكي لقالمة، الجزائر.' : 'Smart city guide for Guelma, Algeria.'}</p>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="hover:text-white">{lang === 'ar' ? 'اكتشف' : 'Discover'}</Link>
          <Link href="/activities" className="hover:text-white">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</Link>
          <Link href="/ai" className="hover:text-white">{lang === 'ar' ? 'الدليل الذكي' : 'AI Guide'}</Link>
        </div>
      </div>
    </footer>
  )
}
