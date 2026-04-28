'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export default function UnverifiedBanner() {
  const { user, isAuthLoading } = useAuth()
  const { lang } = useLanguage()

  if (isAuthLoading || !user || user.email_verified) return null

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
      {lang === 'ar' ? (
        <>
          بريدك الإلكتروني غير موثق.{' '}
          <Link href="/auth" className="font-medium underline hover:text-amber-900">
            اذهب إلى الإعدادات لإعادة الإرسال
          </Link>
        </>
      ) : (
        <>
          Your email is not verified.{' '}
          <Link href="/auth" className="font-medium underline hover:text-amber-900">
            Go to account settings to resend the verification email.
          </Link>
        </>
      )}
    </div>
  )
}
