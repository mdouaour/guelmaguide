'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import MapClient from '@/components/MapClient'
import { getSmartRecommendations } from '@/lib/smartMatch'
import { useLanguage } from '@/context/LanguageContext'
import { getText } from '@/lib/i18n'

const starterPrompts = [
  { en: 'I want a calm place in nature', ar: 'أريد مكاناً هادئاً في الطبيعة' },
  { en: 'Suggest a romantic evening spot', ar: 'اقترح مكاناً رومانسياً للمساء' },
  { en: 'I want food and local culture', ar: 'أريد طعاماً وثقافة محلية' },
  { en: 'I want an active outdoor plan', ar: 'أريد خطة خارجية نشيطة' },
]

export default function AIPage() {
  const { lang } = useLanguage()
  const [input, setInput] = useState('')
  const [submittedInput, setSubmittedInput] = useState('')

  const recommendations = useMemo(() => {
    if (!submittedInput) return null
    return getSmartRecommendations(submittedInput)
  }, [submittedInput])

  const markers = recommendations
    ? [
        ...recommendations.places.map((place) => ({
          id: place.id,
          title: getText(place.name, lang),
          description: getText(place.location, lang),
          coordinates: place.coordinates,
          mapsUrl: place.mapsUrl,
        })),
        ...recommendations.activities.map((activity) => ({
          id: activity.id,
          title: getText(activity.title, lang),
          description: `${activity.date} · ${activity.time}`,
          coordinates: activity.coordinates,
          mapsUrl: `https://maps.google.com/?q=${activity.coordinates.lat},${activity.coordinates.lng}`,
        })),
      ]
    : []

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold">{lang === 'ar' ? 'الدليل الذكي' : 'AI Guide'}</h1>
        <p className="mt-1 text-sm text-white/70">
          {lang === 'ar' ? 'ليس دردشة، بل مطابقة ذكية وحتمية.' : 'No chatbot, just smart deterministic matching.'}
        </p>
      </header>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <label htmlFor="intent" className="text-sm text-white/80">
          {lang === 'ar' ? 'ما الذي ترغب فيه الآن؟' : 'What are you in the mood for?'}
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="intent"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={lang === 'ar' ? 'مثال: أريد مكاناً هادئاً' : 'e.g. I want a calm place'}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-yellow-400/50"
          />
          <button
            onClick={() => setSubmittedInput(input.trim())}
            disabled={!input.trim()}
            className="rounded-xl bg-yellow-500 px-4 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            {lang === 'ar' ? 'مطابقة' : 'Match'}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt.en}
              onClick={() => {
                const selectedPrompt = prompt[lang]
                setInput(selectedPrompt)
                setSubmittedInput(selectedPrompt)
              }}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs hover:border-yellow-400/50"
            >
              {prompt[lang]}
            </button>
          ))}
        </div>
      </div>

      {recommendations ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
            <h2 className="text-lg font-semibold">{lang === 'ar' ? 'التوصيات' : 'Recommendations'}</h2>
            <p className="mt-1 text-sm text-white/70">
              {lang === 'ar' ? 'الاهتمام المطابق:' : 'Matched intent:'} {recommendations.intentTags.join(', ')}
            </p>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-yellow-400">{lang === 'ar' ? 'أفضل الأماكن' : 'Top places'}</h3>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {recommendations.places.map((place) => (
                  <div key={place.id} className="rounded-xl border border-white/10 p-3">
                    <h4 className="font-semibold">{getText(place.name, lang)}</h4>
                    <p className="mt-1 text-xs text-white/60">{getText(place.location, lang)}</p>
                    <p className="mt-2 text-sm text-white/70">{getText(place.description, lang)}</p>
                    <div className="mt-3 flex gap-3 text-xs">
                      <Link href={`/place/${place.slug}`} className="text-yellow-400">{lang === 'ar' ? 'فتح المكان' : 'Open place'}</Link>
                      <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-white/70">{lang === 'ar' ? 'الخريطة' : 'Map link'}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-medium text-yellow-400">{lang === 'ar' ? 'أنشطة مقترحة' : 'Suggested activities'}</h3>
              <div className="mt-2 space-y-3">
                {recommendations.activities.map((activity) => (
                  <div key={activity.id} className="rounded-xl border border-white/10 p-3">
                    <h4 className="font-semibold">{getText(activity.title, lang)}</h4>
                    <p className="mt-1 text-xs text-white/60">{activity.date} · {activity.time}</p>
                    <p className="mt-1 text-sm text-white/70">{getText(activity.description, lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold">{lang === 'ar' ? 'نقاط الخريطة ذات الصلة' : 'Relevant map points'}</h2>
            <p className="mt-1 text-sm text-white/60">
              {lang === 'ar' ? 'تُعرض فقط الأماكن والأنشطة المطابقة.' : 'Only matched places and activities are shown.'}
            </p>
            <div className="mt-3 h-[360px] overflow-hidden rounded-xl border border-white/10">
              <MapClient markers={markers} zoom={12} />
            </div>
          </article>
        </section>
      ) : (
        <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          {lang === 'ar'
            ? 'أرسل تفضيلك للحصول على 3 أماكن وحتى نشاطين مقترحين.'
            : 'Submit your intent to get 3 places and up to 2 activity suggestions.'}
        </p>
      )}
    </div>
  )
}
