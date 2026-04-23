'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import FadeInSection from '@/components/FadeInSection'
import MapClient from '@/components/MapClient'
import {
  getActivities,
  getPlace,
  getPlaces,
  identifierToPlaceKeyword,
  resolvePlaceIdFromIdentifier,
  type Activity,
  type Place,
} from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'
import { firstImageOrCategory } from '@/lib/visuals'

interface PlaceDetailsClientProps {
  placeIdentifier: string
}

export default function PlaceDetailsClient({ placeIdentifier }: PlaceDetailsClientProps) {
  const { lang } = useLanguage()
  const [place, setPlace] = useState<Place | null>(null)
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const resolvedId = resolvePlaceIdFromIdentifier(placeIdentifier)

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let selectedPlace: Place
        if (resolvedId) {
          selectedPlace = await getPlace(resolvedId)
        } else {
          const keyword = identifierToPlaceKeyword(placeIdentifier)
          if (!keyword) {
            throw new Error('Place not found')
          }
          const placeResults = await getPlaces(new URLSearchParams({ keyword, page: '1', limit: '1' }))
          if (!placeResults.results[0]) {
            throw new Error('Place not found')
          }
          selectedPlace = placeResults.results[0]
        }

        const activitiesResponse = await getActivities(
          new URLSearchParams({ place: String(selectedPlace.id), page: '1', limit: '6', availability: 'true' }),
        )

        if (!isMounted) return
        setPlace(selectedPlace)
        setRelatedActivities(activitiesResponse.results)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load place')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [placeIdentifier])

  const markers = useMemo(
    () =>
      place
        ? [
            {
              id: String(place.id),
              title: place.name,
              imageUrl: firstImageOrCategory(place.images, place.category),
              category: place.category,
              description: place.theme,
              coordinates: { lat: place.latitude, lng: place.longitude },
              mapsUrl: `https://maps.google.com/?q=${place.latitude},${place.longitude}`,
            },
          ]
        : [],
    [place],
  )

  if (isLoading) {
    return <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 text-sm text-slate-600">{lang === 'ar' ? 'جاري التحميل...' : 'Loading place...'}</div>
  }

  if (error || !place) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error ?? 'Place not found'}</p>
        <Link href="/discover" className="mt-3 inline-block text-sm text-emerald-700">
          {lang === 'ar' ? '← العودة إلى الاكتشاف' : '← Back to discover'}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <Link href="/discover" className="text-sm text-slate-600 hover:text-slate-900">
        {lang === 'ar' ? '← العودة إلى الاكتشاف' : '← Back to discover'}
      </Link>

      <FadeInSection>
      <section className="tour-card mt-4 overflow-hidden">
        <img src={firstImageOrCategory(place.images, place.category)} alt={place.name} className="h-56 w-full object-cover" />
        <div className="p-6">
        <p className="text-xs uppercase text-[#2E7D32]">{lang === 'ar' ? 'تفاصيل المكان' : 'Place details'}</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">{place.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{place.description}</p>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
          <p>
            <span className="font-medium text-slate-900">{lang === 'ar' ? 'الفئة:' : 'Category:'}</span> {place.category}
          </p>
          <p>
            <span className="font-medium text-slate-900">{lang === 'ar' ? 'الثيم:' : 'Theme:'}</span> {place.theme}
          </p>
          <p>
            <span className="font-medium text-slate-900">{lang === 'ar' ? 'الإحداثيات:' : 'Coordinates:'}</span> {place.latitude}, {place.longitude}
          </p>
        </div>
        </div>
      </section>
      </FadeInSection>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="tour-card p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">{lang === 'ar' ? 'الخريطة' : 'Map'}</h2>
          <div className="mt-3 h-[320px] overflow-hidden rounded-xl border border-emerald-100">
            <MapClient markers={markers} zoom={14} />
          </div>
        </article>

        <article className="tour-card p-4">
          <h2 className="text-lg font-semibold text-slate-900">{lang === 'ar' ? 'أنشطة مرتبطة' : 'Related activities'}</h2>
          <div className="mt-3 space-y-3">
            {relatedActivities.length > 0 ? (
              relatedActivities.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-emerald-100 bg-white p-3">
                  <h3 className="text-sm font-semibold text-slate-900">{activity.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{new Date(activity.date_time).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {activity.participants_count}/{activity.max_participants}
                  </p>
                </div>
              ))
            ) : (
               <p className="rounded-xl border border-emerald-100 p-3 text-sm text-slate-600">
                 {lang === 'ar' ? 'لا توجد أنشطة متاحة حالياً.' : 'No available activities at this place yet.'}
               </p>
            )}
          </div>
          <Link href="/activities" className="mt-4 inline-block text-sm font-medium text-[#2E7D32]">
            {lang === 'ar' ? 'عرض جميع الأنشطة ←' : 'See all activities →'}
          </Link>
        </article>
      </section>
    </div>
  )
}
