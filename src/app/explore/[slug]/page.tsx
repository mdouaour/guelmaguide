import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { landmarks, getLandmarkBySlug, getNearbyLandmarks } from '@/lib/landmarks'
import LandmarkDetail from './LandmarkDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return landmarks.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const lm = getLandmarkBySlug(slug)
  if (!lm) return {}
  return {
    title: `${lm.name} | GuelmaGuide`,
    description: lm.desc,
    openGraph: {
      title: `${lm.name} | GuelmaGuide`,
      description: lm.desc,
      images: [{ url: lm.photo }],
    },
  }
}

export default async function LandmarkPage({ params }: Props) {
  const { slug } = await params
  const lm = getLandmarkBySlug(slug)
  if (!lm) notFound()
  const nearby = getNearbyLandmarks(slug)

  return <LandmarkDetail landmark={lm} nearby={nearby} />
}
