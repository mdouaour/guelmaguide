'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { buildPlacePath, getRecommendations, type RecommendationsResponse } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

const DEFAULT_COORDINATES = { lat: 36.4621, lng: 7.4247 }
const DEMO_USER_EMAIL = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL
const DEMO_USER_PASSWORD = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD

export default function HomePage() {
  const { lang } = useLanguage()
  const { user, token, loginUser, registerUser, isAuthLoading } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null)
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true)
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchRecommendations = async (lat: number, lng: number) => {
      const params = new URLSearchParams({ latitude: String(lat), longitude: String(lng) })
      try {
        const data = await getRecommendations(params, token ?? undefined)
        if (isMounted) setRecommendations(data)
      } catch (error) {
        if (isMounted) {
          setRecommendationsError(
            error instanceof Error
              ? error.message
              : lang === 'ar'
                ? 'تعذر تحميل التوصيات'
                : 'Failed to load recommendations',
          )
        }
      } finally {
        if (isMounted) setIsRecommendationsLoading(false)
      }
    }

    if (!navigator.geolocation) {
      fetchRecommendations(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng)
      return () => {
        isMounted = false
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchRecommendations(position.coords.latitude, position.coords.longitude)
      },
      () => {
        fetchRecommendations(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng)
      },
      { enableHighAccuracy: false, timeout: 2500, maximumAge: 300000 },
    )

    return () => {
      isMounted = false
    }
  }, [lang, token])

  const placeRecommendations = useMemo(
    () => recommendations?.recommended_places.slice(0, 3) ?? [],
    [recommendations],
  )
  const activityRecommendations = useMemo(
    () => recommendations?.recommended_activities.slice(0, 3) ?? [],
    [recommendations],
  )

  const onSubmitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError(null)
    setIsAuthSubmitting(true)
    try {
      if (mode === 'login') {
        await loginUser(email, password)
      } else {
        await registerUser(email, password)
      }
      setPassword('')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
        <p className="mb-2 text-xs uppercase tracking-wide text-emerald-700">
          {lang === 'ar' ? 'دليل مدينة ذكي' : 'Smart city guide'}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          {lang === 'ar' ? 'خطط يومك في قالمة بسهولة' : 'Plan your day in Guelma with confidence'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {lang === 'ar'
            ? 'توصيات فورية، أماكن واضحة، وأنشطة قابلة للانضمام من نفس الواجهة.'
            : 'Instant recommendations, clear place discovery, and activities you can join from one flow.'}
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">{lang === 'ar' ? 'رسالة ترحيب سريعة' : 'Quick onboarding'}</p>
        <p className="mt-1">
          {lang === 'ar'
            ? 'ابدأ بـ: استكشاف الأماكن ← اختيار نشاط ← التوصية الذكية.'
            : 'Start with: discover places → pick an activity → use AI recommendations.'}
        </p>
      </section>

      {DEMO_USER_EMAIL && DEMO_USER_PASSWORD ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
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
            className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:border-emerald-400"
          >
            {lang === 'ar' ? 'استخدم الحساب التجريبي' : 'Use demo credentials'}
          </button>
        </section>
      ) : null}

      {!user && !isAuthLoading ? (
        <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex gap-2 text-sm">
            <button
              onClick={() => setMode('login')}
              className={`rounded-md px-3 py-1.5 ${mode === 'login' ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-700'}`}
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </button>
            <button
              onClick={() => setMode('register')}
              className={`rounded-md px-3 py-1.5 ${mode === 'register' ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-700'}`}
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
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
              required
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isAuthSubmitting}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {mode === 'login' ? (lang === 'ar' ? 'دخول' : 'Sign in') : lang === 'ar' ? 'تسجيل' : 'Create account'}
            </button>
          </form>
          {authError ? <p className="mt-2 text-sm text-rose-600">{authError}</p> : null}
        </section>
      ) : isAuthLoading ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          {lang === 'ar' ? 'جاري تحميل الجلسة...' : 'Loading session...'}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
          {lang === 'ar' ? `مرحباً ${user?.email ?? ''}` : `Welcome ${user?.email ?? ''}`}
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">{lang === 'ar' ? 'توصيات لك الآن' : 'Recommended for you now'}</h2>
        {isRecommendationsLoading ? <p className="mt-2 text-sm text-slate-600">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p> : null}
        {recommendationsError ? <p className="mt-2 text-sm text-rose-600">{recommendationsError}</p> : null}
        {!isRecommendationsLoading && !recommendationsError ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-emerald-700">{lang === 'ar' ? 'أفضل الأماكن' : 'Top places'}</h3>
              <div className="mt-2 space-y-2">
                {placeRecommendations.map((place) => (
                  <Link key={place.id} href={buildPlacePath(place)} className="block rounded-xl border border-slate-200 p-3 hover:border-emerald-300">
                    <p className="font-medium text-slate-900">{place.name}</p>
                    <p className="text-xs text-slate-600">{place.category} · {place.distance_km}km</p>
                  </Link>
                ))}
              </div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-emerald-700">{lang === 'ar' ? 'أنشطة مناسبة' : 'Suggested activities'}</h3>
              <div className="mt-2 space-y-2">
                {activityRecommendations.map((activity) => (
                  <Link
                    key={activity.id}
                    href={buildPlacePath({ id: activity.place_id, name: activity.place_name })}
                    className="block rounded-xl border border-slate-200 p-3 hover:border-emerald-300"
                  >
                    <p className="font-medium text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-600">{new Date(activity.date_time).toLocaleString()}</p>
                    <p className="text-xs text-slate-600">{activity.place_name}</p>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link href="/discover" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 shadow-sm hover:border-emerald-300">
          {lang === 'ar' ? '1) استكشف الأماكن' : '1) Explore places'}
        </Link>
        <Link href="/activities" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 shadow-sm hover:border-emerald-300">
          {lang === 'ar' ? '2) شاهد الأنشطة' : '2) View activities'}
        </Link>
        <Link href="/ai" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 shadow-sm hover:border-emerald-300">
          {lang === 'ar' ? '3) تخصيص عبر الذكاء الاصطناعي' : '3) Personalize with AI'}
        </Link>
      </section>
    </div>
  )
}
