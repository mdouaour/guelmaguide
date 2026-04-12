import { MetadataRoute } from 'next'
import { landmarks } from '@/lib/landmarks'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://guelma.guide'
  const now = new Date()

  const landmarkPages = landmarks.map((l) => ({
    url: `${base}/explore/${l.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/explore`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/map`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/concierge`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...landmarkPages,
  ]
}
