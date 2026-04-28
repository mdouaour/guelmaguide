'use client'

import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import FadeInSection from '@/components/FadeInSection'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { resendVerificationEmail } from '@/lib/api'

const DEMO_USER_EMAIL = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL
const DEMO_USER_PASSWORD = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD

export default function AuthPage() {
  const { lang } = useLanguage()
  const { user, loginUser, registerUser, isAuthLoading } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError(null)
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await loginUser(email, password)
      } else {
        const result = await registerUser(email, password)
        if (result.needsVerification) {
          router.push(`/verify-email-sent?email=${encodeURIComponent(email)}`)
          return
        }
      }
      setPassword('')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onResendVerification = async () => {
    if (!user) return
    setResendStatus('sending')
    try {
      await resendVerificationEmail(user.email)
      setResendStatus('sent')
    } catch {
      setResendStatus('error')
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8">
      <FadeInSection>
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">{lang === 'ar' ? 'الحساب' : 'Account'}</h1>
          <p className="text-sm text-slate-600">
            {lang === 'ar'
              ? 'التصفح متاح للجميع. سجل الدخول فقط عندما تريد الانضمام أو إنشاء نشاط.'
              : 'Browsing is open to everyone. Login is only needed when joining or creating activities.'}
          </p>
        </header>

        {DEMO_USER_EMAIL && DEMO_USER_PASSWORD ? (
          <section className="tour-card mt-4 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{lang === 'ar' ? 'حساب تجريبي' : 'Demo account'}</p>
            <p className="mt-1">
              {lang === 'ar' ? 'البريد:' : 'Email:'} <span className="font-mono">{DEMO_USER_EMAIL}</span>
            </p>
            <button
              onClick={() => {
                setMode('login')
                setEmail(DEMO_USER_EMAIL)
                setPassword(DEMO_USER_PASSWORD)
              }}
              className="mt-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs hover:border-[#2E7D32]"
            >
              {lang === 'ar' ? 'استخدم الحساب التجريبي' : 'Use demo credentials'}
            </button>
          </section>
        ) : null}

        {isAuthLoading ? (
          <section className="tour-card mt-6 p-5 text-sm text-slate-600">
            {lang === 'ar' ? 'جاري تحميل الجلسة...' : 'Loading session...'}
          </section>
        ) : user ? (
          <section className="tour-card mt-6 p-5 text-sm text-slate-700">
            <p className="font-medium text-slate-900">
              {lang === 'ar' ? `مرحباً ${user.email}` : `You are logged in as ${user.email}`}
            </p>
            {!user.email_verified ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <p className="font-medium">
                  {lang === 'ar' ? 'البريد الإلكتروني غير موثق' : 'Email not verified'}
                </p>
                <p className="mt-1">
                  {lang === 'ar'
                    ? 'أرسل لك رابط التحقق إلى بريدك الإلكتروني.'
                    : 'A verification link was sent to your email.'}
                </p>
                {resendStatus === 'sent' ? (
                  <p className="mt-2 text-emerald-700">
                    {lang === 'ar' ? 'تم إعادة الإرسال.' : 'Resent successfully.'}
                  </p>
                ) : (
                  <button
                    onClick={onResendVerification}
                    disabled={resendStatus === 'sending'}
                    className="mt-2 rounded-xl border border-amber-300 px-3 py-1.5 text-xs hover:border-amber-500 disabled:opacity-50"
                  >
                    {resendStatus === 'sending'
                      ? lang === 'ar'
                        ? 'جاري الإرسال...'
                        : 'Sending…'
                      : lang === 'ar'
                        ? 'إعادة إرسال رابط التحقق'
                        : 'Resend verification email'}
                  </button>
                )}
                {resendStatus === 'error' ? (
                  <p className="mt-1 text-rose-600">
                    {lang === 'ar' ? 'فشل الإرسال، حاول مجدداً.' : 'Failed to send, please try again.'}
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/activities" className="rounded-xl bg-[#2E7D32] px-3 py-2 text-white">
                {lang === 'ar' ? 'اذهب للأنشطة' : 'Go to Activities'}
              </Link>
              <Link href="/my-activities" className="rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
                {lang === 'ar' ? 'أنشطتي' : 'My Activities'}
              </Link>
            </div>
          </section>
        ) : (
          <section className="tour-card mt-6 p-5">
            <div className="mb-3 flex gap-2 text-sm">
              <button
                onClick={() => setMode('login')}
                className={`rounded-xl px-3 py-2 ${mode === 'login' ? 'bg-[#2E7D32] text-white' : 'border border-emerald-200 text-slate-700'}`}
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </button>
              <button
                onClick={() => setMode('register')}
                className={`rounded-xl px-3 py-2 ${mode === 'register' ? 'bg-[#2E7D32] text-white' : 'border border-emerald-200 text-slate-700'}`}
              >
                {lang === 'ar' ? 'إنشاء حساب' : 'Register'}
              </button>
            </div>
            <form onSubmit={onSubmitAuth} className="grid gap-3 sm:grid-cols-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@example.com"
                required
                className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                required
                className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white tour-hover disabled:opacity-50"
              >
                {mode === 'login' ? (lang === 'ar' ? 'دخول' : 'Sign in') : lang === 'ar' ? 'تسجيل' : 'Create account'}
              </button>
            </form>
            {authError ? <p className="mt-2 text-sm text-rose-600">{authError}</p> : null}
          </section>
        )}
      </FadeInSection>
    </div>
  )
}
