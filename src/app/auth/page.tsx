'use client'

import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import FadeInSection from '@/components/FadeInSection'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export default function AuthPage() {
  const { lang } = useLanguage()
  const { user, profile, loginUser, registerUser, logout, isAuthLoading } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const onSubmitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError(null)
    setRegistrationSuccess(false)
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await loginUser(email, password)
      } else {
        await registerUser(email, password)
        setRegistrationSuccess(true)
      }
      setPassword('')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Failed to logout')
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

        {isAuthLoading ? (
          <section className="tour-card mt-6 p-5 text-sm text-slate-600">
            {lang === 'ar' ? 'جاري تحميل الجلسة...' : 'Loading session...'}
          </section>
        ) : user ? (
          <section className="tour-card mt-6 p-5 text-sm text-slate-700">
            <p className="font-medium text-slate-900">
              {lang === 'ar' ? `مرحباً ${user.email}` : `You are logged in as ${user.email}`}
            </p>
            {profile ? (
              <p className="mt-1 text-xs text-slate-500">
                {lang === 'ar' ? 'الدور:' : 'Role:'} {profile.role}
                {profile.organizer_verified ? (lang === 'ar' ? ' (موثق)' : ' (verified)') : ''}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/activities" className="rounded-xl bg-[#2E7D32] px-3 py-2 text-white">
                {lang === 'ar' ? 'اذهب للأنشطة' : 'Go to Activities'}
              </Link>
              <Link href="/my-activities" className="rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
                {lang === 'ar' ? 'أنشطتي' : 'My Activities'}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-rose-200 px-3 py-2 text-rose-600 hover:border-rose-400"
              >
                {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          </section>
        ) : (
          <section className="tour-card mt-6 p-5">
            <div className="mb-3 flex gap-2 text-sm">
              <button
                onClick={() => {
                  setMode('login')
                  setRegistrationSuccess(false)
                  setAuthError(null)
                }}
                className={`rounded-xl px-3 py-2 ${mode === 'login' ? 'bg-[#2E7D32] text-white' : 'border border-emerald-200 text-slate-700'}`}
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </button>
              <button
                onClick={() => {
                  setMode('register')
                  setRegistrationSuccess(false)
                  setAuthError(null)
                }}
                className={`rounded-xl px-3 py-2 ${mode === 'register' ? 'bg-[#2E7D32] text-white' : 'border border-emerald-200 text-slate-700'}`}
              >
                {lang === 'ar' ? 'إنشاء حساب' : 'Register'}
              </button>
            </div>

            {registrationSuccess ? (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                {lang === 'ar'
                  ? 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.'
                  : 'Account created! Check your email to confirm your account.'}
              </div>
            ) : null}

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
                minLength={6}
                className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white tour-hover disabled:opacity-50"
              >
                {isSubmitting
                  ? (lang === 'ar' ? 'جاري...' : 'Loading...')
                  : mode === 'login'
                    ? (lang === 'ar' ? 'دخول' : 'Sign in')
                    : (lang === 'ar' ? 'تسجيل' : 'Create account')}
              </button>
            </form>
            {authError ? <p className="mt-2 text-sm text-rose-600">{authError}</p> : null}
          </section>
        )}
      </FadeInSection>
    </div>
  )
}
