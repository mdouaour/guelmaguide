'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import FadeInSection from '@/components/FadeInSection'
import MapClient from '@/components/MapClient'
import { buildPlacePath, getRecommendations, type RecommendationsResponse } from '@/lib/api'
import { getCategoryImage } from '@/lib/visuals'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

const DEFAULT_COORDINATES = { lat: 36.4621, lng: 7.4247 }

export default function AIPage() {
  const { lang } = useLanguage()
  const { token } = useAuth()
  const [category, setCategory] = useState('')
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | ''>('')
  const [data, setData] = useState<RecommendationsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setIsLoading(true)
    setError(null)
    const params = new URLSearchParams({
      latitude: String(DEFAULT_COORDINATES.lat),
      longitude: String(DEFAULT_COORDINATES.lng),
    })
    if (category.trim()) params.set('category', category.trim())
    if (timeOfDay) params.set('time_of_day', timeOfDay)

    try {
      const response = await getRecommendations(params, token ?? undefined)
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  const markers = useMemo(
    () =>
      data
        ? [
            ...data.recommended_places.map((place) => ({
              id: `place-${place.id}`,
              title: place.name,
              imageUrl: getCategoryImage(place.category),
              category: place.category,
              description: `${place.category} · ${place.distance_km}km`,
              coordinates: { lat: place.latitude, lng: place.longitude },
              mapsUrl: `https://maps.google.com/?q=${place.latitude},${place.longitude}`,
              detailsUrl: buildPlacePath(place),
            })),
            ...data.recommended_activities.map((activity) => ({
              id: `activity-${activity.id}`,
              title: activity.title,
              imageUrl: getCategoryImage(activity.place_category),
              category: activity.place_category,
              description: `${activity.place_name} · ${activity.available_slots}`,
              coordinates:
                data.recommended_places.find((place) => place.id === activity.place_id)?.latitude !==
                undefined
                  ? {
                      lat: data.recommended_places.find((place) => place.id === activity.place_id)!.latitude,
                      lng: data.recommended_places.find((place) => place.id === activity.place_id)!.longitude,
                    }
                  : DEFAULT_COORDINATES,
            })),
          ]
        : [],
    [data],
  )

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <FadeInSection>
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">{lang === 'ar' ? 'الدليل الذكي' : 'AI Guide'}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {lang === 'ar' ? 'مساعد ذكي لاختيار أفضل الأماكن والأنشطة حسب مزاجك.' : 'A smart helper for finding the best places and activities for your mood.'}
        </p>
      </header>

      <div className="tour-card mt-4 grid gap-3 p-4 sm:grid-cols-3">
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder={lang === 'ar' ? 'category (nature, culture...)' : 'category (nature, culture...)'}
          className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
        />
        <select
          value={timeOfDay}
          onChange={(event) => setTimeOfDay(event.target.value as 'morning' | 'afternoon' | 'evening' | '')}
          className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
        >
          <option value="">all day</option>
          <option value="morning">morning</option>
          <option value="afternoon">afternoon</option>
          <option value="evening">evening</option>
        </select>
        <button onClick={submit} disabled={isLoading} className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white tour-hover disabled:opacity-50">
          {isLoading ? (lang === 'ar' ? 'تحميل...' : 'Loading...') : lang === 'ar' ? 'توصية' : 'Recommend'}
        </button>
      </div>
      </FadeInSection>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      {data ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <article className="tour-card p-4 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">{lang === 'ar' ? 'التوصيات' : 'Recommendations'}</h2>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-[#2E7D32]">{lang === 'ar' ? 'الأماكن' : 'Places'}</h3>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {data.recommended_places.map((place) => (
                  <Link key={place.id} href={buildPlacePath(place)} className="tour-card tour-hover block rounded-xl p-3">
                    <h4 className="font-semibold text-slate-900">{place.name}</h4>
                    <p className="mt-1 text-xs text-slate-600">{place.category} · {place.theme}</p>
                    <p className="mt-1 text-xs text-slate-500">{place.distance_km}km</p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-sm font-medium text-[#2E7D32]">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</h3>
              <div className="mt-2 space-y-3">
                {data.recommended_activities.map((activity) => (
                  <Link
                    key={activity.id}
                    href={buildPlacePath({ id: activity.place_id, name: activity.place_name })}
                    className="tour-card tour-hover block rounded-xl p-3"
                  >
                    <h4 className="font-semibold text-slate-900">{activity.title}</h4>
                    <p className="mt-1 text-xs text-slate-600">{activity.place_name}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(activity.date_time).toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          </article>
          <article className="tour-card p-4">
            <h2 className="text-lg font-semibold text-slate-900">{lang === 'ar' ? 'الخريطة' : 'Map'}</h2>
            <div className="mt-3 h-[360px] overflow-hidden rounded-xl border border-emerald-100">
              <MapClient markers={markers} zoom={12} />
            </div>
          </article>
        </section>
      ) : (
        <p className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          {lang === 'ar' ? 'اختر فلترًا ثم احصل على توصيات.' : 'Select filters and get recommendations.'}
        </p>
      )}
    </div>
  )
}
