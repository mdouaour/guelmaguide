'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import MapClient from '@/components/MapClient'
import { getSmartRecommendations } from '@/lib/smartMatch'

const starterPrompts = [
  'I want a calm place in nature',
  'Suggest a romantic evening spot',
  'I want food and local culture',
  'I want an active outdoor plan',
]

export default function AIPage() {
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
          title: place.name,
          description: place.location,
          coordinates: place.coordinates,
          mapsUrl: place.mapsUrl,
        })),
        ...recommendations.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          description: `${activity.date} · ${activity.time}`,
          coordinates: activity.coordinates,
          mapsUrl: `https://maps.google.com/?q=${activity.coordinates.lat},${activity.coordinates.lng}`,
        })),
      ]
    : []

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold">AI Guide</h1>
        <p className="mt-1 text-sm text-white/70">No chatbot, just smart deterministic matching.</p>
      </header>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <label htmlFor="intent" className="text-sm text-white/80">What are you in the mood for?</label>
        <div className="mt-2 flex gap-2">
          <input
            id="intent"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="e.g. I want a calm place"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-yellow-400/50"
          />
          <button
            onClick={() => setSubmittedInput(input.trim())}
            disabled={!input.trim()}
            className="rounded-xl bg-yellow-500 px-4 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            Match
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInput(prompt)
                setSubmittedInput(prompt)
              }}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs hover:border-yellow-400/50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {recommendations ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
            <h2 className="text-lg font-semibold">Recommendations</h2>
            <p className="mt-1 text-sm text-white/70">Matched intent: {recommendations.intentTags.join(', ')}</p>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-yellow-400">Top places</h3>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {recommendations.places.map((place) => (
                  <div key={place.id} className="rounded-xl border border-white/10 p-3">
                    <h4 className="font-semibold">{place.name}</h4>
                    <p className="mt-1 text-xs text-white/60">{place.location}</p>
                    <p className="mt-2 text-sm text-white/70">{place.description}</p>
                    <div className="mt-3 flex gap-3 text-xs">
                      <Link href={`/place/${place.slug}`} className="text-yellow-400">Open place</Link>
                      <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-white/70">Map link</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-medium text-yellow-400">Suggested activities</h3>
              <div className="mt-2 space-y-3">
                {recommendations.activities.map((activity) => (
                  <div key={activity.id} className="rounded-xl border border-white/10 p-3">
                    <h4 className="font-semibold">{activity.title}</h4>
                    <p className="mt-1 text-xs text-white/60">{activity.date} · {activity.time}</p>
                    <p className="mt-1 text-sm text-white/70">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold">Relevant map points</h2>
            <p className="mt-1 text-sm text-white/60">Only matched places and activities are shown.</p>
            <div className="mt-3 h-[360px] overflow-hidden rounded-xl border border-white/10">
              <MapClient markers={markers} zoom={12} />
            </div>
          </article>
        </section>
      ) : (
        <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Submit your intent to get 3 places and up to 2 activity suggestions.</p>
      )}
    </div>
  )
}
