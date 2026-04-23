'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import FadeInSection from '@/components/FadeInSection'
import { buildPlacePath, getActivities, getPlaces, type Activity, type Place } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { getActivityImage, getCategoryImage } from '@/lib/visuals'

export default function HomePage() {
  const { lang } = useLanguage()
  const { token } = useAuth()
  const [places, setPlaces] = useState<Place[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [previewError, setPreviewError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadPreview = async () => {
      setIsLoading(true)
      setPreviewError(null)
      try {
        const placesParams = new URLSearchParams({ page: '1', limit: '6' })
        const activitiesParams = new URLSearchParams({ page: '1', limit: '3' })
        const [placesResponse, activitiesResponse] = await Promise.all([
          getPlaces(placesParams),
          getActivities(activitiesParams),
        ])
        if (!isMounted) return
        setPlaces(placesResponse.results.slice(0, 6))
        setActivities(activitiesResponse.results.slice(0, 3))
      } catch (error) {
        if (!isMounted) return
        setPreviewError(error instanceof Error ? error.message : 'Failed to load homepage preview')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadPreview()

    return () => {
      isMounted = false
    }
  }, [])

  const isLoggedIn = useMemo(() => Boolean(token), [token])

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
              {lang === 'ar' ? 'مرحبا بك في قالمة' : 'Welcome to Guelma'}
            </p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Discover Guelma 🌿</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              {lang === 'ar'
                ? 'استكشف الأماكن الطبيعية والأنشطة المحلية بسهولة، واستخدم الدليل الذكي لتخطيط يومك.'
                : 'Explore local places and activities with a clear, simple flow, then use the AI guide to plan your day.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/discover"
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#2E7D32] tour-hover"
              >
                {lang === 'ar' ? 'استكشف الأماكن' : 'Explore Places'}
              </Link>
              <Link
                href="/activities"
                className="rounded-xl border border-white/80 px-4 py-2.5 text-sm font-medium text-white tour-hover"
              >
                {lang === 'ar' ? 'عرض الأنشطة' : 'View Activities'}
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {!isLoggedIn ? (
        <FadeInSection className="mt-5">
          <section className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-slate-700">
            {lang === 'ar'
              ? 'يمكنك التصفح بدون تسجيل. يلزم تسجيل الدخول فقط للانضمام للأنشطة أو إنشاء نشاط.'
              : 'Browse freely without login. Login is only required when you join or create an activity.'}
            <Link href="/auth" className="ml-2 text-[#2E7D32] underline">
              {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Link>
          </section>
        </FadeInSection>
      ) : null}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900">{lang === 'ar' ? 'نظرة سريعة' : 'Preview'}</h2>
        {isLoading ? <p className="mt-2 text-sm text-slate-600">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p> : null}
        {previewError ? <p className="mt-2 text-sm text-rose-600">{previewError}</p> : null}
        {!isLoading && !previewError ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <article>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#2E7D32]">
                {lang === 'ar' ? 'أماكن مميزة' : 'Places'}
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {places.map((place) => (
                  <Link key={place.id} href={buildPlacePath(place)} className="tour-card tour-hover block overflow-hidden">
                    <img src={getCategoryImage(place.category)} alt={place.name} className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="inline-flex rounded-full bg-[#eaf6ef] px-2 py-0.5 text-[10px] uppercase text-[#2E7D32]">{place.category}</p>
                      <p className="mt-1 font-medium text-slate-900">{place.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
            <article>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#FF7043]">
                {lang === 'ar' ? 'أنشطة قادمة' : 'Activities'}
              </h3>
              <div className="mt-3 space-y-3">
                {activities.map((activity) => (
                  <article key={activity.id} className="tour-card overflow-hidden">
                    <img src={getActivityImage(activity.title)} alt={activity.title} className="h-24 w-full object-cover" />
                    <div className="p-3">
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600">{new Date(activity.date_time).toLocaleString()}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </section>

      <FadeInSection className="mt-8">
        <section className="tour-card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#2E7D32]">{lang === 'ar' ? 'الدليل الذكي' : 'AI Guide'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {lang === 'ar' ? 'اقترح لي أفضل الأماكن والأنشطة' : 'Get smart place and activity suggestions'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {lang === 'ar'
              ? 'استخدم الدليل الذكي للحصول على توصيات سريعة حسب اهتماماتك.'
              : 'Use the AI guide for quick recommendations based on your interests.'}
          </p>
          <Link href="/ai" className="mt-4 inline-flex rounded-xl bg-[#2E7D32] px-4 py-2 text-sm font-medium text-white tour-hover">
            {lang === 'ar' ? 'جرب الدليل الذكي' : 'Try AI Guide'}
          </Link>
        </section>
      </FadeInSection>
    </div>
  )
}
