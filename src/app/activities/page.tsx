'use client'

import Link from 'next/link'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import FadeInSection from '@/components/FadeInSection'
import {
  createActivity,
  getActivities,
  getMyActivities,
  getPlaces,
  joinActivity,
  leaveActivity,
  type Activity,
  type Place,
} from '@/lib/api'
import { getActivityImage } from '@/lib/visuals'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const limit = 10

function toIsoDateTime(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString()
}

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

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([])
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [createTitle, setCreateTitle] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createPlaceId, setCreatePlaceId] = useState('')
  const [createDateTime, setCreateDateTime] = useState('')
  const [createMaxParticipants, setCreateMaxParticipants] = useState('10')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadPlaces = async () => {
      setIsLoadingPlaces(true)
      try {
        const response = await getPlaces(new URLSearchParams({ limit: '100' }))
        if (!isMounted) return
        setAvailablePlaces(response.results)
      } catch {
        // places dropdown will show empty; not critical
      } finally {
        if (isMounted) setIsLoadingPlaces(false)
      }
    }
    loadPlaces()
    return () => {
      isMounted = false
    }
  }, [])

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

  const onCreateActivity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) {
      setError(lang === 'ar' ? 'يرجى تسجيل الدخول أولاً.' : 'Please login first.')
      return
    }
    const placeId = Number(createPlaceId)
    const maxParticipants = Number(createMaxParticipants)
    const isoDateTime = toIsoDateTime(createDateTime)
    if (!placeId || !maxParticipants || !isoDateTime) {
      setError(lang === 'ar' ? 'تحقق من بيانات النشاط.' : 'Please check the activity details.')
      return
    }

    setIsCreating(true)
    setError(null)
    try {
      const created = await createActivity(
        {
          title: createTitle.trim(),
          description: createDescription.trim(),
          place_id: placeId,
          date_time: isoDateTime,
          max_participants: maxParticipants,
        },
        token,
      )
      setActivities((previous) => [created, ...previous].slice(0, limit))
      setTotal((previous) => previous + 1)
      setShowCreateForm(false)
      setCreateTitle('')
      setCreateDescription('')
      setCreatePlaceId('')
      setCreateDateTime('')
      setCreateMaxParticipants('10')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <FadeInSection>
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</h1>
          <p className="text-sm text-slate-600">
            {lang === 'ar'
              ? 'تصفح الأنشطة بحرية. تسجيل الدخول مطلوب فقط للانضمام أو إنشاء نشاط.'
              : 'Browse activities freely. Login is only required to join or create one.'}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/my-activities" className="rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]">
              {lang === 'ar' ? 'أنشطتي' : 'My Activities'}
            </Link>
            {!token ? (
              <Link href="/auth" className="rounded-xl bg-[#2E7D32] px-3 py-2 text-white">
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Link>
            ) : null}
            <button
              onClick={() => {
                if (!token) {
                  setError(lang === 'ar' ? 'يرجى تسجيل الدخول أولاً.' : 'Please login first.')
                  return
                }
                setShowCreateForm((previous) => !previous)
              }}
              className="rounded-xl border border-emerald-200 px-3 py-2 hover:border-[#2E7D32]"
            >
              {lang === 'ar' ? 'إنشاء نشاط' : 'Create Activity'}
            </button>
          </div>
        </header>

        {showCreateForm ? (
          <form onSubmit={onCreateActivity} className="tour-card mt-4 grid gap-3 p-4 sm:grid-cols-2">
            <input
              value={createTitle}
              onChange={(event) => setCreateTitle(event.target.value)}
              required
              minLength={3}
              placeholder={lang === 'ar' ? 'عنوان النشاط' : 'Activity title'}
              className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
            />
            <select
              value={createPlaceId}
              onChange={(event) => setCreatePlaceId(event.target.value)}
              required
              disabled={isLoadingPlaces}
              className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32] disabled:opacity-50"
            >
              <option value="">
                {isLoadingPlaces
                  ? lang === 'ar' ? 'جاري التحميل...' : 'Loading places...'
                  : lang === 'ar' ? 'اختر مكانًا' : 'Select a place'}
              </option>
              {availablePlaces.map((place) => (
                <option key={place.id} value={String(place.id)}>
                  {place.name}
                </option>
              ))}
            </select>
            <textarea
              value={createDescription}
              onChange={(event) => setCreateDescription(event.target.value)}
              required
              minLength={10}
              placeholder={lang === 'ar' ? 'وصف النشاط' : 'Description'}
              className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32] sm:col-span-2"
            />
            <input
              type="datetime-local"
              value={createDateTime}
              onChange={(event) => setCreateDateTime(event.target.value)}
              required
              className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
            />
            <input
              type="number"
              min={1}
              value={createMaxParticipants}
              onChange={(event) => setCreateMaxParticipants(event.target.value)}
              required
              placeholder={lang === 'ar' ? 'الحد الأقصى للمشاركين' : 'Max participants'}
              className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white tour-hover disabled:opacity-50 sm:col-span-2"
            >
              {isCreating ? (lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...') : lang === 'ar' ? 'حفظ النشاط' : 'Save activity'}
            </button>
          </form>
        ) : null}

        <div className="tour-card mt-4 grid gap-3 p-4 sm:grid-cols-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => {
              setPage(1)
              setDateFilter(event.target.value)
            }}
            className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
          />
          <select
            value={placeFilter}
            onChange={(event) => {
              setPage(1)
              setPlaceFilter(event.target.value)
            }}
            disabled={isLoadingPlaces}
            className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32] disabled:opacity-50"
          >
            <option value="">
              {lang === 'ar' ? 'جميع الأماكن' : 'All places'}
            </option>
            {availablePlaces.map((place) => (
              <option key={place.id} value={String(place.id)}>
                {place.name}
              </option>
            ))}
          </select>
          <label className="flex min-h-[48px] items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700">
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
      </FadeInSection>

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
            <FadeInSection key={activity.id}>
              <article className="tour-card tour-hover overflow-hidden">
                <img src={getActivityImage(activity.title)} alt={activity.title} className="h-40 w-full object-cover" />
                <div className="p-4">
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
                    className={`mt-3 min-h-[40px] rounded-xl px-3 py-2 text-xs font-medium ${isJoined ? 'border border-[#FF7043] text-[#FF7043]' : 'bg-[#2E7D32] text-white'} disabled:cursor-not-allowed disabled:opacity-50`}
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
                </div>
              </article>
            </FadeInSection>
          )
        })}
      </section>

      <div className="tour-card mt-6 flex items-center justify-between p-4 text-sm text-slate-700">
        <p>
          {lang === 'ar' ? 'الصفحة' : 'Page'} {page} / {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            className="rounded-xl border border-emerald-200 px-3 py-2 disabled:opacity-50"
          >
            {lang === 'ar' ? 'السابق' : 'Prev'}
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
            className="rounded-xl border border-emerald-200 px-3 py-2 disabled:opacity-50"
          >
            {lang === 'ar' ? 'التالي' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
