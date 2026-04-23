'use client'

import { useEffect, useMemo, useState } from 'react'
import { getActivities, getMyActivities, joinActivity, leaveActivity, type Activity } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const limit = 10

export default function ActivitiesPage() {
  const { lang } = useLanguage()
  const { token } = useAuth()
  const [dateFilter, setDateFilter] = useState('')
  const [placeFilter, setPlaceFilter] = useState('')
  const [availabilityOnly, setAvailabilityOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [activities, setActivities] = useState<Activity[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinedIds, setJoinedIds] = useState<number[]>([])
  const [isSyncingJoined, setIsSyncingJoined] = useState(false)
  const [joiningActivityId, setJoiningActivityId] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadActivities = async () => {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (dateFilter) params.set('date', dateFilter)
      if (placeFilter.trim()) params.set('place', placeFilter.trim())
      if (availabilityOnly) params.set('availability', 'true')

      try {
        const response = await getActivities(params)
        if (!isMounted) return
        setActivities(response.results)
        setTotal(response.total)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load activities')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadActivities()

    return () => {
      isMounted = false
    }
  }, [availabilityOnly, dateFilter, page, placeFilter])

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const joinedSet = useMemo(() => new Set(joinedIds), [joinedIds])

  useEffect(() => {
    let isMounted = true
    const syncJoinedActivities = async () => {
      if (!token) {
        setJoinedIds([])
        return
      }
      setIsSyncingJoined(true)
      try {
        const joinedActivities = await getMyActivities(token)
        if (!isMounted) return
        setJoinedIds(joinedActivities.map((activity) => activity.id))
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to sync joined activities')
      } finally {
        if (isMounted) setIsSyncingJoined(false)
      }
    }
    syncJoinedActivities()
    return () => {
      isMounted = false
    }
  }, [token])

  const toggleJoin = async (activityId: number) => {
    if (!token) {
      setError(lang === 'ar' ? 'يرجى تسجيل الدخول للانضمام.' : 'Please login to join activities.')
      return
    }
    try {
      const currentlyJoined = joinedSet.has(activityId)
      setJoiningActivityId(activityId)
      if (currentlyJoined) {
        await leaveActivity(activityId, token)
        setJoinedIds((previous) => previous.filter((id) => id !== activityId))
      } else {
        await joinActivity(activityId, token)
        setJoinedIds((previous) =>
          previous.includes(activityId) ? previous : [...previous, activityId],
        )
      }
      setActivities((previous) =>
        previous.map((activity) =>
          activity.id === activityId
            ? {
                ...activity,
                participants_count: currentlyJoined
                  ? Math.max(0, activity.participants_count - 1)
                  : activity.participants_count + 1,
              }
            : activity,
        ),
      )
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update registration')
    } finally {
      setJoiningActivityId(null)
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {lang === 'ar' ? 'تصفية حسب التاريخ والتوفر والمكان.' : 'Filter by date, availability, and place.'}
        </p>
      </header>

      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        <input
          type="date"
          value={dateFilter}
          onChange={(event) => {
            setPage(1)
            setDateFilter(event.target.value)
          }}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
        />
        <input
          type="number"
          min={1}
          value={placeFilter}
          onChange={(event) => {
            setPage(1)
            setPlaceFilter(event.target.value)
          }}
          placeholder={lang === 'ar' ? 'رقم المكان' : 'Place ID'}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
        />
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={availabilityOnly}
            onChange={(event) => {
              setPage(1)
              setAvailabilityOnly(event.target.checked)
            }}
          />
          {lang === 'ar' ? 'متاح فقط' : 'Available only'}
        </label>
      </div>

      {isLoading ? <p className="mt-4 text-sm text-slate-600">{lang === 'ar' ? 'جاري التحميل...' : 'Loading activities...'}</p> : null}
      {isSyncingJoined ? (
        <p className="mt-2 text-xs text-slate-500">
          {lang === 'ar' ? 'مزامنة الأنشطة المنضم إليها...' : 'Syncing joined activities...'}
        </p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {activities.map((activity) => {
          const isJoined = joinedSet.has(activity.id)
          const isFull = activity.participants_count >= activity.max_participants && !isJoined
          return (
            <article key={activity.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{activity.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
              <p className="mt-2 text-xs text-slate-500">{new Date(activity.date_time).toLocaleString()}</p>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'المكان' : 'Place'} #{activity.place_id}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {activity.participants_count}/{activity.max_participants} {lang === 'ar' ? 'مشاركين' : 'participants'}
              </p>
              <button
                onClick={() => toggleJoin(activity.id)}
                disabled={isFull || joiningActivityId === activity.id}
                className="mt-3 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {joiningActivityId === activity.id
                  ? lang === 'ar'
                    ? 'جارٍ التحديث...'
                    : 'Updating...'
                  : isJoined
                    ? lang === 'ar'
                      ? 'مغادرة'
                      : 'Leave'
                    : lang === 'ar'
                      ? 'انضمام'
                      : 'Join'}
              </button>
            </article>
          )
        })}
      </section>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
        <p>
          {lang === 'ar' ? 'الصفحة' : 'Page'} {page} / {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-50"
          >
            {lang === 'ar' ? 'السابق' : 'Prev'}
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
            className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-50"
          >
            {lang === 'ar' ? 'التالي' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
