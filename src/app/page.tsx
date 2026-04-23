'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import FadeInSection from '@/components/FadeInSection'
import { buildPlacePath, getRecommendations, type RecommendationsResponse } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getActivityImage, getCategoryImage } from '@/lib/visuals'

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

  const onGoogleContinue = () => {
    setAuthError(lang === 'ar' ? 'تسجيل Google قيد التجهيز.' : 'Google sign-in is coming soon.')
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <FadeInSection>
        <section className="relative overflow-hidden rounded-3xl border border-emerald-100">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(46,125,50,0.74), rgba(79,195,247,0.58)), url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1800&q=80&auto=format&fit=crop')",
            }}
          />
          <div className="relative p-7 sm:p-10">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-white/85">
              {lang === 'ar' ? 'تجربة سياحية ممتعة' : 'Tourism experience'}
            </p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Discover Guelma 🌿</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              {lang === 'ar'
                ? 'أماكن طبيعية، أنشطة ممتعة، وتوصيات ذكية تساعدك تعيش قالمة بأجمل شكل.'
                : 'Nature spots, local activities, and smart recommendations to enjoy Guelma beautifully.'}
            </p>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection className="mt-5 grid gap-3 sm:grid-cols-3">
        <Link href="/discover" className="tour-card tour-hover min-h-[86px] p-4">
          <p className="text-xs uppercase text-[#2E7D32]">{lang === 'ar' ? 'خطوة 1' : 'Quick action'}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{lang === 'ar' ? 'استكشف الأماكن' : 'Explore Places'}</p>
        </Link>
        <Link href="/activities" className="tour-card tour-hover min-h-[86px] p-4">
          <p className="text-xs uppercase text-[#2E7D32]">{lang === 'ar' ? 'خطوة 2' : 'Quick action'}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</p>
        </Link>
        <Link href="/ai" className="tour-card tour-hover min-h-[86px] p-4">
          <p className="text-xs uppercase text-[#2E7D32]">{lang === 'ar' ? 'خطوة 3' : 'Quick action'}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{lang === 'ar' ? 'الدليل الذكي' : 'AI Guide'}</p>
        </Link>
      </FadeInSection>

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

      {!user && !isAuthLoading ? (
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
              disabled={isAuthSubmitting}
              className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white tour-hover disabled:opacity-50"
            >
              {mode === 'login' ? (lang === 'ar' ? 'دخول' : 'Sign in') : lang === 'ar' ? 'تسجيل' : 'Create account'}
            </button>
          </form>
          <button
            type="button"
            onClick={onGoogleContinue}
            className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#4FC3F7] bg-[#f2fbff] px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#e8f8ff]"
          >
            {lang === 'ar' ? 'المتابعة عبر Google' : 'Continue with Google'}
          </button>
          {authError ? <p className="mt-2 text-sm text-rose-600">{authError}</p> : null}
        </section>
      ) : isAuthLoading ? (
        <section className="tour-card mt-6 p-5 text-sm text-slate-600">
          {lang === 'ar' ? 'جاري تحميل الجلسة...' : 'Loading session...'}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-[#4FC3F7] bg-[#ecf9ff] p-4 text-sm text-slate-800">
          {lang === 'ar' ? `مرحباً ${user?.email ?? ''}` : `Welcome ${user?.email ?? ''}`}
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">{lang === 'ar' ? 'توصيات مميزة' : 'Recommended for you'}</h2>
        {isRecommendationsLoading ? <p className="mt-2 text-sm text-slate-600">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p> : null}
        {recommendationsError ? <p className="mt-2 text-sm text-rose-600">{recommendationsError}</p> : null}
        {!isRecommendationsLoading && !recommendationsError ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="tour-card p-4">
              <h3 className="text-sm font-semibold text-[#2E7D32]">{lang === 'ar' ? 'أفضل الأماكن' : 'Top places'}</h3>
              <div className="mt-2 space-y-3">
                {placeRecommendations.map((place) => (
                  <Link key={place.id} href={buildPlacePath(place)} className="tour-card tour-hover block overflow-hidden">
                    <img src={getCategoryImage(place.category)} alt={place.name} className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="inline-flex rounded-full bg-[#eaf6ef] px-2 py-0.5 text-[10px] uppercase text-[#2E7D32]">{place.category}</p>
                      <p className="mt-1 font-medium text-slate-900">{place.name}</p>
                      <p className="text-xs text-slate-600">{place.theme} · {place.distance_km}km</p>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
            <article className="tour-card p-4">
              <h3 className="text-sm font-semibold text-[#FF7043]">{lang === 'ar' ? 'أنشطة مناسبة' : 'Suggested activities'}</h3>
              <div className="mt-2 space-y-3">
                {activityRecommendations.map((activity) => (
                  <Link
                    key={activity.id}
                    href={buildPlacePath({ id: activity.place_id, name: activity.place_name })}
                    className="tour-card tour-hover block overflow-hidden"
                  >
                    <img src={getActivityImage(activity.title)} alt={activity.title} className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="inline-flex rounded-full bg-[#fff2ed] px-2 py-0.5 text-[10px] uppercase text-[#FF7043]">{lang === 'ar' ? 'نشاط' : 'Activity'}</p>
                      <p className="mt-1 font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600">{new Date(activity.date_time).toLocaleString()}</p>
                      <p className="text-xs text-slate-600">{activity.place_name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </section>
    </div>
  )
}
