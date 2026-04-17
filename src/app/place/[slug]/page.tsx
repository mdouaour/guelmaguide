import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PlaceDetailsClient from '@/components/PlaceDetailsClient'
import { getActivityById } from '@/lib/activities'
import { getLandmarkBySlug, landmarks } from '@/lib/landmarks'
import { getText } from '@/lib/i18n'

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
    title: `${getText(landmark.name, 'en')} | GuelmaGuide`,
    description: getText(landmark.description, 'en'),
  }
}

export default async function PlacePage({ params }: PageProps) {
  const { slug } = await params
  const landmark = getLandmarkBySlug(slug)

  if (!landmark) notFound()

  const relatedActivities = (landmark.relatedActivitiesIds ?? [])
    .map((id) => getActivityById(id))
    .filter((activity) => activity !== undefined)

  return <PlaceDetailsClient landmark={landmark} relatedActivities={relatedActivities} />
}
