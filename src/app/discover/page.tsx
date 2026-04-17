'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAllLandmarkTags, landmarks, type DiscoveryTag } from '@/lib/landmarks'
import { useEffect } from 'react'
import { getText } from '@/lib/i18n'
import { useLanguage } from '@/context/LanguageContext'
import { getEnrichedLandmarks } from '@/lib/enrichData'
import type { Landmark } from '@/lib/landmarks'

export default function DiscoverPage() {
  const { lang } = useLanguage()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<DiscoveryTag | 'all'>('all')
  const [landmarkData, setLandmarkData] = useState<Landmark[]>(landmarks)
  const [isRefreshing, setIsRefreshing] = useState(true)
  const tags = getAllLandmarkTags()

  useEffect(() => {
    getEnrichedLandmarks(landmarks)
      .then(setLandmarkData)
      .finally(() => setIsRefreshing(false))
  }, [])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredLandmarks = landmarkData.filter((landmark) => {
    const matchesTag = activeTag === 'all' || landmark.tags.includes(activeTag)
    const name = getText(landmark.name, lang).toLowerCase()
    const location = getText(landmark.location, lang).toLowerCase()
    const description = getText(landmark.description, lang).toLowerCase()
    const matchesQuery =
      !normalizedQuery ||
      name.includes(normalizedQuery) ||
      location.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      landmark.tags.some((tag) => tag.includes(normalizedQuery))

    return matchesTag && matchesQuery
  })

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold">{lang === 'ar' ? 'اكتشف الأماكن' : 'Discover Places'}</h1>
        <p className="mt-1 text-sm text-white/70">{lang === 'ar' ? 'ابحث وصفِّ المعالم حسب الوسوم.' : 'Search and filter landmarks by tags.'}</p>
        {isRefreshing ? (
          <p className="mt-1 text-xs text-white/50">{lang === 'ar' ? 'جاري تحديث المحتوى من مصادر عامة...' : 'Refreshing content from public sources...'}</p>
        ) : null}
      </header>

      <div className="mt-4 grid gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={lang === 'ar' ? 'ابحث بالاسم أو الطابع أو الموقع أو الوسم' : 'Search by name, vibe, location, or tag'}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-yellow-400/50"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag('all')}
            className={`rounded-full px-3 py-1.5 text-xs ${activeTag === 'all' ? 'bg-yellow-500 text-black' : 'border border-white/10 bg-white/5'}`}
          >
            {lang === 'ar' ? 'الكل' : 'all'}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1.5 text-xs ${activeTag === tag ? 'bg-yellow-500 text-black' : 'border border-white/10 bg-white/5'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLandmarks.map((landmark) => (
          <article key={landmark.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img src={landmark.image} alt={getText(landmark.name, lang)} className="h-40 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs text-yellow-400">{getText(landmark.vibe, lang)}</p>
              <h2 className="mt-1 text-lg font-semibold">{getText(landmark.name, lang)}</h2>
              <p className="mt-1 text-sm text-white/70">{getText(landmark.description, lang)}</p>
              <p className="mt-2 text-xs text-white/60">
                {getText(landmark.location, lang)} · {lang === 'ar' ? 'أفضل وقت:' : 'Best:'} {getText(landmark.bestTime, lang)}
              </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {landmark.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/70">#{tag}</span>
              ))}
            </div>
              <Link href={`/place/${landmark.slug}`} className="mt-4 inline-block text-sm text-yellow-400">
                {lang === 'ar' ? 'فتح المكان ←' : 'Open place →'}
              </Link>
            </div>
          </article>
        ))}
      </section>

      {filteredLandmarks.length === 0 ? (
        <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          {lang === 'ar' ? 'لا توجد أماكن مطابقة لهذا الفلتر حالياً.' : 'No places match this filter yet.'}
        </p>
      ) : null}
    </div>
  )
}
