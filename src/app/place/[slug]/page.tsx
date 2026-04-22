import PlaceDetailsClient from '@/components/PlaceDetailsClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PlacePage({ params }: PageProps) {
  const { slug } = await params
  return <PlaceDetailsClient placeIdentifier={slug} />
}
