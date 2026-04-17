import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MapClient from '@/components/MapClient'
import { getActivityById } from '@/lib/activities'
import { getLandmarkBySlug, landmarks } from '@/lib/landmarks'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return landmarks.map((landmark) => ({ slug: landmark.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const landmark = getLandmarkBySlug(slug)

  if (!landmark) {
    return {
      title: 'Place not found | GuelmaGuide',
    }
  }

  return {
    title: `${landmark.name} | GuelmaGuide`,
    description: landmark.description,
  }
}

export default async function PlacePage({ params }: PageProps) {
  const { slug } = await params
  const landmark = getLandmarkBySlug(slug)

  if (!landmark) notFound()

  const relatedActivities = (landmark.relatedActivitiesIds ?? [])
    .map((id) => getActivityById(id))
    .filter((activity) => activity !== undefined)

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <Link href="/discover" className="text-sm text-white/70 hover:text-white">← Back to discover</Link>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase text-yellow-400">Place details</p>
        <h1 className="mt-1 text-3xl font-semibold">{landmark.name}</h1>
        <p className="mt-2 text-sm text-white/70">{landmark.description}</p>
        <div className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-3">
          <p><span className="text-white">Vibe:</span> {landmark.vibe}</p>
          <p><span className="text-white">Best time:</span> {landmark.bestTime}</p>
          <p><span className="text-white">Location:</span> {landmark.location}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {landmark.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/70">#{tag}</span>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Map</h2>
          <p className="mt-1 text-sm text-white/60">Secondary map view focused only on this place.</p>
          <div className="mt-3 h-[320px] overflow-hidden rounded-xl border border-white/10">
            <MapClient
              markers={[
                {
                  id: landmark.id,
                  title: landmark.name,
                  description: landmark.location,
                  coordinates: landmark.coordinates,
                  mapsUrl: landmark.mapsUrl,
                },
              ]}
              zoom={14}
            />
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">Related activities</h2>
          <p className="mt-1 text-sm text-white/60">What you can do nearby.</p>
          <div className="mt-3 space-y-3">
            {relatedActivities.length > 0 ? (
              relatedActivities.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs uppercase text-yellow-400">{activity.type}</p>
                  <h3 className="mt-1 text-sm font-semibold">{activity.title}</h3>
                  <p className="mt-1 text-xs text-white/60">{activity.date} · {activity.time}</p>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-white/10 p-3 text-sm text-white/70">No linked activities for now.</p>
            )}
          </div>
          <Link href="/activities" className="mt-4 inline-block text-sm text-yellow-400">See all activities →</Link>
        </article>
      </section>
    </div>
  )
}
