import type { Activity } from '@/lib/activities'
import type { Landmark } from '@/lib/landmarks'

const WIKIPEDIA_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary'
const WIKIMEDIA_ENDPOINT = 'https://commons.wikimedia.org/w/api.php'

function compactSummary(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean)
  return sentences.slice(0, 2).join(' ')
}

async function fetchWikipediaSummary(title: string): Promise<string | null> {
  try {
    const response = await fetch(`${WIKIPEDIA_ENDPOINT}/${encodeURIComponent(title)}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) return null
    const data = (await response.json()) as { extract?: string }
    return data.extract ? compactSummary(data.extract) : null
  } catch {
    return null
  }
}

async function fetchWikimediaImage(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '1280',
    generator: 'search',
    gsrlimit: '1',
    gsrsearch: query,
  })

  try {
    const response = await fetch(`${WIKIMEDIA_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) return null
    const data = (await response.json()) as {
      query?: {
        pages?: Record<string, { thumbnail?: { source?: string } }>
      }
    }

    const pages = data.query?.pages ? Object.values(data.query.pages) : []
    const thumbnail = pages[0]?.thumbnail?.source
    return typeof thumbnail === 'string' ? thumbnail : null
  } catch {
    return null
  }
}

export async function enrichLandmarks(landmarks: Landmark[]): Promise<Landmark[]> {
  return Promise.all(
    landmarks.map(async (landmark) => {
      const [wikipediaDescription, wikimediaImage] = await Promise.all([
        fetchWikipediaSummary(landmark.wikipediaTitle),
        fetchWikimediaImage(landmark.wikimediaSearch),
      ])

      return {
        ...landmark,
        description: {
          ...landmark.description,
          en: wikipediaDescription ?? landmark.description.en,
        },
        image: wikimediaImage ?? landmark.image,
      }
    }),
  )
}

export async function enrichActivities(activities: Activity[]): Promise<Activity[]> {
  return Promise.all(
    activities.map(async (activity) => {
      const [wikipediaDescription, wikimediaImage] = await Promise.all([
        fetchWikipediaSummary(activity.wikipediaTitle),
        fetchWikimediaImage(activity.wikimediaSearch),
      ])

      return {
        ...activity,
        description: {
          ...activity.description,
          en: wikipediaDescription ?? activity.description.en,
        },
        image: wikimediaImage ?? activity.image,
      }
    }),
  )
}
