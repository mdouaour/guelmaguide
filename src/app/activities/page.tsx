'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { activities, activityTypes, type Activity, type ActivityType } from '@/lib/activities'
import { useLanguage } from '@/context/LanguageContext'
import { getText } from '@/lib/i18n'
import { getEnrichedActivities } from '@/lib/enrichData'

const BOOKMARK_KEY = 'guelmaguide:bookmarked-activities'

type DateFilter = 'all' | 'this-week' | 'upcoming'

const activityTypeLabels: Record<Exclude<ActivityType, 'all'> | 'all', { en: string; ar: string }> = {
  all: { en: 'all', ar: 'الكل' },
  wellness: { en: 'wellness', ar: 'استجمام' },
  culture: { en: 'culture', ar: 'ثقافة' },
  food: { en: 'food', ar: 'طعام' },
  outdoor: { en: 'outdoor', ar: 'هواء طلق' },
  sport: { en: 'sport', ar: 'رياضة' },
  social: { en: 'social', ar: 'اجتماعي' },
}

function getDateFilterMatch(activityDate: string, filter: DateFilter) {
  if (filter === 'all') return true

  const today = new Date('2026-04-20')
  const date = new Date(activityDate)
  const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (filter === 'this-week') return diffDays >= 0 && diffDays <= 7
  return diffDays > 7
}

export default function ActivitiesPage() {
  const { lang } = useLanguage()
  const [typeFilter, setTypeFilter] = useState<ActivityType>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [activityData, setActivityData] = useState<Activity[]>(activities)
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(BOOKMARK_KEY)
    if (!raw) return []

    try {
      return JSON.parse(raw) as string[]
    } catch {
      return []
    }
  })

  const filteredActivities = useMemo(() => {
    return activityData.filter((activity) => {
      const matchesType = typeFilter === 'all' || activity.type === typeFilter
      const matchesDate = getDateFilterMatch(activity.date, dateFilter)
      return matchesType && matchesDate
    })
  }, [activityData, dateFilter, typeFilter])

  useEffect(() => {
    getEnrichedActivities(activities)
      .then(setActivityData)
      .finally(() => setIsRefreshing(false))
  }, [])

  const toggleBookmark = (activityId: string) => {
    setBookmarks((previous) => {
      const next = previous.includes(activityId)
        ? previous.filter((id) => id !== activityId)
        : [...previous, activityId]

      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold">{lang === 'ar' ? 'الأنشطة' : 'Activities'}</h1>
        <p className="mt-1 text-sm text-white/70">
          {lang === 'ar' ? 'صفِّ حسب النوع والتاريخ ثم احفظ ما يعجبك.' : 'Filter by type and date, then bookmark what you like.'}
        </p>
        {isRefreshing ? (
          <p className="mt-1 text-xs text-white/50">{lang === 'ar' ? 'جاري تحديث الأنشطة بمحتوى موثوق...' : 'Refreshing activities with trusted public content...'}</p>
        ) : null}
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-full px-3 py-1.5 text-xs ${typeFilter === type ? 'bg-yellow-500 text-black' : 'border border-white/10 bg-white/5'}`}
            >
              {activityTypeLabels[type][lang]}
            </button>
          ))}
        </div>

        <div className="flex gap-2 sm:justify-end">
          {(['all', 'this-week', 'upcoming'] as DateFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-xs ${dateFilter === filter ? 'bg-yellow-500 text-black' : 'border border-white/10 bg-white/5'}`}
            >
              {lang === 'ar'
                ? filter === 'all'
                  ? 'الكل'
                  : filter === 'this-week'
                    ? 'هذا الأسبوع'
                    : 'قادمة'
                : filter}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {filteredActivities.map((activity) => {
          const isBookmarked = bookmarks.includes(activity.id)

          return (
            <article key={activity.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img src={activity.image} alt={getText(activity.title, lang)} className="h-44 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs uppercase text-yellow-400">{activity.type}</p>
                <h2 className="mt-1 text-lg font-semibold">{getText(activity.title, lang)}</h2>
                <p className="mt-1 text-sm text-white/70">{getText(activity.description, lang)}</p>
                <p className="mt-2 text-xs text-white/60">{activity.date} · {activity.time}</p>
                <p className="mt-1 text-xs text-white/60">{getText(activity.location, lang)}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/70">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => toggleBookmark(activity.id)}
                    className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:border-yellow-400/50"
                  >
                    {lang === 'ar' ? (isBookmarked ? 'تم الحفظ' : 'حفظ') : isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  <a href={`https://maps.google.com/?q=${activity.coordinates.lat},${activity.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:border-yellow-400/50">
                    {lang === 'ar' ? 'الخريطة' : 'Map link'}
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        {lang === 'ar' ? 'تحتاج مساعدة للاختيار؟ ' : 'Need help choosing? '}
        <Link href="/ai" className="text-yellow-400">{lang === 'ar' ? 'استخدم الدليل الذكي' : 'Use the AI guide'}</Link>.
      </div>
    </div>
  )
}
