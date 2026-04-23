'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import MapClient from '@/components/MapClient'
import FadeInSection from '@/components/FadeInSection'
import { buildPlacePath, getPlaces, type Place } from '@/lib/api'
import { firstImageOrCategory } from '@/lib/visuals'
import { useLanguage } from '@/context/LanguageContext'

const categories = ['all', 'forest', 'culture', 'nature', 'sports', 'relaxation', 'thermal_baths'] as const
const limit = 12

export default function DiscoverPage() {
  const { lang } = useLanguage()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('keyword') ?? '')
  const [theme, setTheme] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('all')
  const [page, setPage] = useState(1)
  const [places, setPlaces] = useState<Place[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const keywordFromUrl = searchParams.get('keyword') ?? ''

  useEffect(() => {
    setPage(1)
    setQuery(keywordFromUrl)
  }, [keywordFromUrl])

  useEffect(() => {
    let isMounted = true
    const loadPlaces = async () => {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })
      if (query.trim()) params.set('keyword', query.trim())
      if (theme.trim()) params.set('theme', theme.trim())
      if (category !== 'all') params.set('category', category)

      try {
        const response = await getPlaces(params)
        if (!isMounted) return
        setPlaces(response.results)
        setTotal(response.total)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Failed to load places')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPlaces()

    return () => {
      isMounted = false
    }
  }, [category, page, query, theme])

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const mapMarkers = useMemo(
    () =>
      places.map((place) => ({
        id: String(place.id),
        title: place.name,
        imageUrl: firstImageOrCategory(place.images, place.category),
        category: place.category,
        description: `${place.category} · ${place.theme}`,
        coordinates: { lat: place.latitude, lng: place.longitude },
        mapsUrl: `https://maps.google.com/?q=${place.latitude},${place.longitude}`,
        detailsUrl: buildPlacePath(place),
      })),
    [places],
  )

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <FadeInSection>
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">{lang === 'ar' ? 'اكتشف الأماكن' : 'Discover Places'}</h1>
        <p className="mt-1 text-sm text-slate-600">{lang === 'ar' ? 'اكتشف أفضل الوجهات الطبيعية والثقافية في قالمة.' : 'Explore the best nature and culture spots in Guelma.'}</p>
      </header>

      <div className="tour-card mt-4 grid gap-3 p-4 sm:grid-cols-3">
        <input
          value={query}
          onChange={(event) => {
            setPage(1)
            setQuery(event.target.value)
          }}
          placeholder={lang === 'ar' ? 'بحث بالكلمة المفتاحية' : 'Keyword search'}
          className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
        />
        <input
          value={theme}
          onChange={(event) => {
            setPage(1)
            setTheme(event.target.value)
          }}
          placeholder={lang === 'ar' ? 'الثيم (nature, relaxation...)' : 'Theme (nature, relaxation...)'}
          className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
        />
        <select
          value={category}
          onChange={(event) => {
            setPage(1)
            setCategory(event.target.value as (typeof categories)[number])
          }}
          className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2E7D32]"
        >
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      </FadeInSection>

      <section className="mt-5 grid gap-6 lg:grid-cols-3">
        <FadeInSection className="lg:col-span-1">
        <article className="tour-card p-3">
          <h2 className="text-sm font-semibold text-[#2E7D32]">{lang === 'ar' ? 'الخريطة' : 'Map'}</h2>
          <div className="mt-2 h-[420px] overflow-hidden rounded-xl border border-emerald-100">
            <MapClient markers={mapMarkers} zoom={12} />
          </div>
        </article>
        </FadeInSection>

        <article className="lg:col-span-2">
          {isLoading ? <p className="text-sm text-slate-600">{lang === 'ar' ? 'جاري التحميل...' : 'Loading places...'}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {places.map((place) => (
              <FadeInSection key={place.id}>
              <article className="tour-card tour-hover overflow-hidden">
                <img src={firstImageOrCategory(place.images, place.category)} alt={place.name} className="h-40 w-full object-cover" />
                <div className="p-4">
                <p className="inline-flex rounded-full bg-[#eaf6ef] px-2 py-0.5 text-xs uppercase text-[#2E7D32]">{place.category}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{place.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{place.description}</p>
                <p className="mt-2 text-xs text-slate-500">{place.theme}</p>
                <Link href={buildPlacePath(place)} className="mt-3 inline-block text-sm font-medium text-[#2E7D32]">
                  {lang === 'ar' ? 'عرض التفاصيل ←' : 'View details →'}
                </Link>
                </div>
              </article>
              </FadeInSection>
            ))}
          </div>
          {places.length === 0 && !isLoading ? (
            <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              {lang === 'ar' ? 'لا توجد نتائج مطابقة.' : 'No places match your filters.'}
            </p>
          ) : null}
        </article>
      </section>

      <div className="tour-card mt-6 flex items-center justify-between p-4 text-sm text-slate-700">
        <p>
          {lang === 'ar' ? 'الصفحة' : 'Page'} {page} / {totalPages} · {lang === 'ar' ? 'الإجمالي' : 'Total'} {total}
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
