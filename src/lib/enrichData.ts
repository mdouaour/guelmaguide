import type { Activity } from '@/lib/activities'
import type { Landmark } from '@/lib/landmarks'

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const WIKIPEDIA_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary'
const WIKIMEDIA_ENDPOINT = 'https://commons.wikimedia.org/w/api.php'
const OSM_SEARCH_CENTER = { lat: 36.4621, lng: 7.4247 }
const OSM_SEARCH_RADIUS_METERS = 30000
const CACHE_TTL_MS = 1000 * 60 * 60 * 12
const LOCAL_CACHE_PREFIX = 'guelmaguide:enrich'
const UNSPLASH_FALLBACK_BASE = 'https://source.unsplash.com/1600x900/?'

interface CacheEnvelope<T> {
  expiresAt: number
  value: T
}

export interface OSMPlace {
  id: string
  name: string
  lat: number
  lng: number
  kind: 'tourism' | 'leisure' | 'historic'
  wikipediaTitle: string | null
}

let landmarksCache: Landmark[] | null = null
let activitiesCache: Activity[] | null = null
let landmarksPending: Promise<Landmark[]> | null = null
let activitiesPending: Promise<Activity[]> | null = null
let placesCache: OSMPlace[] | null = null
let placesPending: Promise<OSMPlace[]> | null = null

const wikipediaSummaryCache = new Map<string, string | null>()
const wikimediaImageCache = new Map<string, string | null>()

interface OSMElement {
  id?: number
  lat?: number
  lon?: number
  center?: {
    lat?: number
    lon?: number
  }
  tags?: Record<string, string>
}

interface OSMResponse {
  elements?: OSMElement[]
}

interface WikipediaSummaryResponse {
  extract?: string
}

interface WikimediaResponse {
  query?: {
    pages?: Record<string, { thumbnail?: { source?: string } }>
  }
}

/**
 * Normalize whitespace and extract a short preview from long text.
 * @param text Raw summary text from external content sources.
 * @returns A compact summary limited to the first two sentences.
 */
function compactSummary(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean)
  return sentences.slice(0, 2).join(' ')
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function getLocalCache<T>(key: string): T | null {
  if (!isBrowser()) return null

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheEnvelope<T>

    if (typeof parsed.expiresAt !== 'number' || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(key)
      return null
    }

    return parsed.value
  } catch {
    return null
  }
}

function setLocalCache<T>(key: string, value: T): void {
  if (!isBrowser()) return

  try {
    const payload: CacheEnvelope<T> = {
      expiresAt: Date.now() + CACHE_TTL_MS,
      value,
    }

    window.localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // Ignore quota and serialization issues.
  }
}

function getWithTimeout(input: string, init: RequestInit = {}, timeoutMs = 4500): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId)
  })
}

function normalizeWikipediaTitle(rawTitle: string): string | null {
  const title = rawTitle.trim()
  if (!title) return null
  return title.replace(/^[a-z]{2}:/i, '').trim()
}

function buildUnsplashFallback(title: string): string {
  const query = title.trim() || 'guelma,algeria,travel'
  return `${UNSPLASH_FALLBACK_BASE}${encodeURIComponent(`${query},guelma,algeria`)}`
}

function mapToOSMPlaces(data: OSMResponse): OSMPlace[] {
  const elements = data.elements ?? []
  const places = elements
    .map((element): OSMPlace | null => {
      const tags = element.tags
      if (!tags) return null

      const kind = tags.tourism ? 'tourism' : tags.leisure ? 'leisure' : tags.historic ? 'historic' : null
      if (!kind) return null

      const name = tags.name?.trim()
      const lat = element.lat ?? element.center?.lat
      const lng = element.lon ?? element.center?.lon
      if (!name || typeof lat !== 'number' || typeof lng !== 'number' || typeof element.id !== 'number') return null

      return {
        id: `${kind}-${element.id}`,
        name,
        lat,
        lng,
        kind,
        wikipediaTitle: normalizeWikipediaTitle(tags.wikipedia ?? ''),
      }
    })
    .filter((place): place is OSMPlace => place !== null)

  const unique = new Map<string, OSMPlace>()
  for (const place of places) {
    if (!unique.has(place.id)) unique.set(place.id, place)
  }

  return [...unique.values()]
}

function calculateDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const earthRadiusKm = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const haversine =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function findClosestPlace(coordinates: { lat: number; lng: number }, places: OSMPlace[]): OSMPlace | null {
  let nearest: OSMPlace | null = null
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const place of places) {
    const distance = calculateDistanceKm(coordinates, { lat: place.lat, lng: place.lng })
    if (distance <= 8 && distance < nearestDistance) {
      nearestDistance = distance
      nearest = place
    }
  }

  return nearest
}

export async function fetchPlacesFromOSM(): Promise<OSMPlace[]> {
  if (placesCache) return placesCache

  const localStorageKey = `${LOCAL_CACHE_PREFIX}:osm-places`
  const localCached = getLocalCache<OSMPlace[]>(localStorageKey)
  if (localCached) {
    placesCache = localCached
    return localCached
  }

  if (!placesPending) {
    const query = `
      [out:json][timeout:12];
      (
        nwr["tourism"](around:${OSM_SEARCH_RADIUS_METERS},${OSM_SEARCH_CENTER.lat},${OSM_SEARCH_CENTER.lng});
        nwr["leisure"](around:${OSM_SEARCH_RADIUS_METERS},${OSM_SEARCH_CENTER.lat},${OSM_SEARCH_CENTER.lng});
        nwr["historic"](around:${OSM_SEARCH_RADIUS_METERS},${OSM_SEARCH_CENTER.lat},${OSM_SEARCH_CENTER.lng});
      );
      out center 120;
    `.trim()

    placesPending = getWithTimeout(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `data=${encodeURIComponent(query)}`,
      cache: 'force-cache',
    })
      .then(async (response) => {
        if (!response.ok) return []
        const data = (await response.json()) as OSMResponse
        const mappedPlaces = mapToOSMPlaces(data)
        placesCache = mappedPlaces
        setLocalCache(localStorageKey, mappedPlaces)
        return mappedPlaces
      })
      .catch(() => [])
      .finally(() => {
        placesPending = null
      })
  }

  return placesPending
}

export async function fetchWikipediaSummary(title: string): Promise<string | null> {
  const normalizedTitle = title.trim()
  if (!normalizedTitle) return null
  if (wikipediaSummaryCache.has(normalizedTitle)) return wikipediaSummaryCache.get(normalizedTitle) ?? null

  const localStorageKey = `${LOCAL_CACHE_PREFIX}:wikipedia:${normalizedTitle.toLowerCase()}`
  const localCached = getLocalCache<string | null>(localStorageKey)
  if (localCached !== null) {
    wikipediaSummaryCache.set(normalizedTitle, localCached)
    return localCached
  }

  try {
    const response = await getWithTimeout(`${WIKIPEDIA_ENDPOINT}/${encodeURIComponent(normalizedTitle)}`, {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    })

    if (!response.ok) {
      wikipediaSummaryCache.set(normalizedTitle, null)
      setLocalCache(localStorageKey, null)
      return null
    }

    const data = (await response.json()) as WikipediaSummaryResponse
    const summary = data.extract ? compactSummary(data.extract) : null
    wikipediaSummaryCache.set(normalizedTitle, summary)
    setLocalCache(localStorageKey, summary)
    return summary
  } catch {
    wikipediaSummaryCache.set(normalizedTitle, null)
    return null
  }
}

export async function fetchWikimediaImage(title: string): Promise<string | null> {
  const normalizedTitle = title.trim()
  if (!normalizedTitle) return buildUnsplashFallback('guelma,algeria,travel')
  if (wikimediaImageCache.has(normalizedTitle)) return wikimediaImageCache.get(normalizedTitle) ?? null

  const localStorageKey = `${LOCAL_CACHE_PREFIX}:wikimedia:${normalizedTitle.toLowerCase()}`
  const localCached = getLocalCache<string | null>(localStorageKey)
  if (localCached !== null) {
    wikimediaImageCache.set(normalizedTitle, localCached)
    return localCached
  }

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '1280',
    generator: 'search',
    gsrlimit: '1',
    gsrsearch: normalizedTitle,
  })

  try {
    const response = await getWithTimeout(`${WIKIMEDIA_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      cache: 'force-cache',
    })

    if (!response.ok) {
      const fallback = buildUnsplashFallback(normalizedTitle)
      wikimediaImageCache.set(normalizedTitle, fallback)
      setLocalCache(localStorageKey, fallback)
      return fallback
    }

    const data = (await response.json()) as WikimediaResponse

    const pages = data.query?.pages ? Object.values(data.query.pages) : []
    const thumbnail = pages[0]?.thumbnail?.source
    const result = typeof thumbnail === 'string' ? thumbnail : buildUnsplashFallback(normalizedTitle)
    wikimediaImageCache.set(normalizedTitle, result)
    setLocalCache(localStorageKey, result)
    return result
  } catch {
    const fallback = buildUnsplashFallback(normalizedTitle)
    wikimediaImageCache.set(normalizedTitle, fallback)
    return fallback
  }
}

export async function enrichLandmarks(landmarks: Landmark[]): Promise<Landmark[]> {
  const places = await fetchPlacesFromOSM()

  return Promise.all(
    landmarks.map(async (landmark) => {
      const closestPlace = findClosestPlace(landmark.coordinates, places)
      const [wikipediaDescription, wikimediaImage] = await Promise.all([
        fetchWikipediaSummary(closestPlace?.wikipediaTitle ?? landmark.wikipediaTitle),
        fetchWikimediaImage(closestPlace?.name ?? landmark.wikimediaSearch),
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
  const places = await fetchPlacesFromOSM()

  return Promise.all(
    activities.map(async (activity) => {
      const closestPlace = findClosestPlace(activity.coordinates, places)
      const [wikipediaDescription, wikimediaImage] = await Promise.all([
        fetchWikipediaSummary(closestPlace?.wikipediaTitle ?? activity.wikipediaTitle),
        fetchWikimediaImage(closestPlace?.name ?? activity.wikimediaSearch),
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

export async function getEnrichedLandmarks(landmarks: Landmark[]): Promise<Landmark[]> {
  if (landmarksCache) return landmarksCache
  if (!landmarksPending) {
    landmarksPending = enrichLandmarks(landmarks)
      .then((result) => {
        landmarksCache = result
        return result
      })
      .catch((error) => {
        console.warn('Failed to enrich landmarks, using static fallback.', error)
        return landmarks
      })
      .finally(() => {
        landmarksPending = null
      })
  }

  return landmarksPending
}

export async function getEnrichedActivities(activities: Activity[]): Promise<Activity[]> {
  if (activitiesCache) return activitiesCache
  if (!activitiesPending) {
    activitiesPending = enrichActivities(activities)
      .then((result) => {
        activitiesCache = result
        return result
      })
      .catch((error) => {
        console.warn('Failed to enrich activities, using static fallback.', error)
        return activities
      })
      .finally(() => {
        activitiesPending = null
      })
  }

  return activitiesPending
}
