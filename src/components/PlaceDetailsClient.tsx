'use client'

import Link from 'next/link'
import MapClient from '@/components/MapClient'
import type { Activity } from '@/lib/activities'
import type { Landmark } from '@/lib/landmarks'
import { getText } from '@/lib/i18n'
import { useLanguage } from '@/context/LanguageContext'

interface PlaceDetailsClientProps {
  landmark: Landmark
  relatedActivities: Activity[]
}

export default function PlaceDetailsClient({ landmark, relatedActivities }: PlaceDetailsClientProps) {
  const { lang } = useLanguage()

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <Link href="/discover" className="text-sm text-white/70 hover:text-white">
        {lang === 'ar' ? '← العودة إلى الاكتشاف' : '← Back to discover'}
      </Link>

      <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <img src={landmark.image} alt={getText(landmark.name, lang)} className="h-64 w-full object-cover sm:h-80" />
        <div className="p-6">
          <p className="text-xs uppercase text-yellow-400">{lang === 'ar' ? 'تفاصيل المكان' : 'Place details'}</p>
          <h1 className="mt-1 text-3xl font-semibold">{getText(landmark.name, lang)}</h1>
          <p className="mt-2 text-sm text-white/70">{getText(landmark.description, lang)}</p>
          {landmark.history ? <p className="mt-2 text-sm text-white/60">{getText(landmark.history, lang)}</p> : null}
          <div className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-3">
            <p>
              <span className="text-white">{lang === 'ar' ? 'الطابع:' : 'Vibe:'}</span> {getText(landmark.vibe, lang)}
            </p>
            <p>
              <span className="text-white">{lang === 'ar' ? 'أفضل وقت:' : 'Best time:'}</span> {getText(landmark.bestTime, lang)}
            </p>
            <p>
              <span className="text-white">{lang === 'ar' ? 'الموقع:' : 'Location:'}</span> {getText(landmark.location, lang)}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {landmark.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/70">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">{lang === 'ar' ? 'الخريطة' : 'Map'}</h2>
          <p className="mt-1 text-sm text-white/60">
            {lang === 'ar' ? 'عرض ثانوي للخريطة يركز على هذا المكان فقط.' : 'Secondary map view focused only on this place.'}
          </p>
          <div className="mt-3 h-[320px] overflow-hidden rounded-xl border border-white/10">
            <MapClient
              markers={[
                {
                  id: landmark.id,
                  title: getText(landmark.name, lang),
                  description: getText(landmark.location, lang),
                  coordinates: landmark.coordinates,
                  mapsUrl: landmark.mapsUrl,
                },
              ]}
              zoom={14}
            />
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">{lang === 'ar' ? 'أنشطة مرتبطة' : 'Related activities'}</h2>
          <p className="mt-1 text-sm text-white/60">{lang === 'ar' ? 'ما يمكنك فعله بالقرب من هذا المكان.' : 'What you can do nearby.'}</p>
          <div className="mt-3 space-y-3">
            {relatedActivities.length > 0 ? (
              relatedActivities.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs uppercase text-yellow-400">{activity.type}</p>
                  <h3 className="mt-1 text-sm font-semibold">{getText(activity.title, lang)}</h3>
                  <p className="mt-1 text-xs text-white/60">
                    {activity.date} · {activity.time}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-white/10 p-3 text-sm text-white/70">
                {lang === 'ar' ? 'لا توجد أنشطة مرتبطة حالياً.' : 'No linked activities for now.'}
              </p>
            )}
          </div>
          <Link href="/activities" className="mt-4 inline-block text-sm text-yellow-400">
            {lang === 'ar' ? 'عرض جميع الأنشطة ←' : 'See all activities →'}
          </Link>
        </article>
      </section>
    </div>
  )
}
