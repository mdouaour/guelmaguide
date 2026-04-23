'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import FadeInSection from '@/components/FadeInSection'
import { getMyActivities, type Activity } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000

export default function MyActivitiesPage() {
  const { lang } = useLanguage()
  const { token } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadMyActivities = async () => {
      if (!token) {
        setActivities([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const response = await getMyActivities(token)
        if (!isMounted) return
        const sorted = [...response].sort(
          (left, right) => new Date(left.date_time).getTime() - new Date(right.date_time).getTime(),
        )
        setActivities(sorted)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load your activities')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadMyActivities()
    return () => {
      isMounted = false
    }
  }, [token])

  const hasSoonActivity = useMemo(() => {
    const now = Date.now()
    return activities.some((activity) => {
      const eventTime = new Date(activity.date_time).getTime()
      return eventTime > now && eventTime - now <= TWO_HOURS_IN_MS
    })
  }, [activities])

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8">
      <FadeInSection>
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">{lang === 'ar' ? 'أنشطتي' : 'My Activities'}</h1>
          <p className="text-sm text-slate-600">
            {lang === 'ar' ? 'الأنشطة التي انضممت إليها مع الحالة الحالية.' : 'Activities you joined with current status.'}
          </p>
        </header>

        {!token ? (
          <section className="tour-card mt-4 p-4 text-sm text-slate-700">
            <p>{lang === 'ar' ? 'يلزم تسجيل الدخول لعرض أنشطتك.' : 'Login is required to view your activities.'}</p>
            <Link href="/auth" className="mt-2 inline-flex rounded-xl bg-[#2E7D32] px-3 py-2 text-white">
              {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Link>
          </section>
        ) : null}

        {token && hasSoonActivity ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Your activity is coming soon
          </div>
        ) : null}

        {isLoading ? <p className="mt-4 text-sm text-slate-600">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

        {token && !isLoading && !error ? (
          <section className="mt-5 space-y-3">
            {activities.map((activity) => {
              const isUpcoming = new Date(activity.date_time).getTime() > Date.now()
              return (
                <article key={activity.id} className="tour-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900">{activity.title}</h2>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${isUpcoming ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}
                    >
                      {isUpcoming
                        ? lang === 'ar'
                          ? 'قادم'
                          : 'upcoming'
                        : lang === 'ar'
                          ? 'منتهي'
                          : 'past'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{new Date(activity.date_time).toLocaleString()}</p>
                </article>
              )
            })}
            {activities.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                {lang === 'ar' ? 'لم تنضم لأي نشاط بعد.' : 'You have not joined any activity yet.'}
              </p>
            ) : null}
          </section>
        ) : null}
      </FadeInSection>
    </div>
  )
}
