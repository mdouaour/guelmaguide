'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAllLandmarkTags, landmarks, type DiscoveryTag } from '@/lib/landmarks'

export default function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<DiscoveryTag | 'all'>('all')
  const tags = getAllLandmarkTags()

  const normalizedQuery = query.trim().toLowerCase()
  const filteredLandmarks = landmarks.filter((landmark) => {
    const matchesTag = activeTag === 'all' || landmark.tags.includes(activeTag)
    const matchesQuery =
      !normalizedQuery ||
      landmark.name.toLowerCase().includes(normalizedQuery) ||
      landmark.location.toLowerCase().includes(normalizedQuery) ||
      landmark.description.toLowerCase().includes(normalizedQuery) ||
      landmark.tags.some((tag) => tag.includes(normalizedQuery))

    return matchesTag && matchesQuery
  })

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Discover Places</h1>
        <p className="mt-1 text-sm text-white/70">Search and filter landmarks by tags.</p>
      </header>

      <div className="mt-4 grid gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, vibe, location, or tag"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-yellow-400/50"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag('all')}
            className={`rounded-full px-3 py-1.5 text-xs ${activeTag === 'all' ? 'bg-yellow-500 text-black' : 'border border-white/10 bg-white/5'}`}
          >
            all
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
          <article key={landmark.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-yellow-400">{landmark.vibe}</p>
            <h2 className="mt-1 text-lg font-semibold">{landmark.name}</h2>
            <p className="mt-1 text-sm text-white/70">{landmark.description}</p>
            <p className="mt-2 text-xs text-white/60">{landmark.location} · Best: {landmark.bestTime}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {landmark.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/70">#{tag}</span>
              ))}
            </div>
            <Link href={`/place/${landmark.slug}`} className="mt-4 inline-block text-sm text-yellow-400">Open place →</Link>
          </article>
        ))}
      </section>

      {filteredLandmarks.length === 0 ? (
        <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">No places match this filter yet.</p>
      ) : null}
    </div>
  )
}
