'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import FadeInSection from '@/components/FadeInSection'
import { verifyEmail } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'

function VerifyEmailContent() {
  const { lang } = useLanguage()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage(lang === 'ar' ? 'رمز التحقق مفقود.' : 'Verification token is missing.')
      return
    }

    verifyEmail(token)
      .then((data) => {
        setMessage(data.message)
        setStatus('success')
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : 'Verification failed.')
        setStatus('error')
      })
    // Run only on mount; token and lang are stable for this page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {lang === 'ar' ? 'التحقق من البريد الإلكتروني' : 'Email Verification'}
        </h1>
      </header>

      <section className="tour-card mt-6 p-5 text-sm">
        {status === 'loading' ? (
          <p className="text-slate-600">
            {lang === 'ar' ? 'جاري التحقق...' : 'Verifying your email…'}
          </p>
        ) : status === 'success' ? (
          <>
            <p className="font-medium text-emerald-700">
              {lang === 'ar' ? '✓ تم التحقق بنجاح!' : '✓ Email verified successfully!'}
            </p>
            {message ? <p className="mt-1 text-slate-600">{message}</p> : null}
            <Link
              href="/auth"
              className="mt-3 inline-block rounded-xl bg-[#2E7D32] px-4 py-2 text-white tour-hover"
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
            </Link>
          </>
        ) : (
          <>
            <p className="font-medium text-rose-600">
              {lang === 'ar' ? 'فشل التحقق' : 'Verification failed'}
            </p>
            {message ? <p className="mt-1 text-slate-600">{message}</p> : null}
            <Link
              href="/verify-email-sent"
              className="mt-3 inline-block rounded-xl border border-emerald-200 px-4 py-2 text-slate-700 hover:border-[#2E7D32]"
            >
              {lang === 'ar' ? 'إعادة إرسال رابط التحقق' : 'Resend verification link'}
            </Link>
          </>
        )}
      </section>
    </>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8">
      <FadeInSection>
        <Suspense>
          <VerifyEmailContent />
        </Suspense>
      </FadeInSection>
    </div>
  )
}
