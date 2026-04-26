// API client for GuelmaGuide - now using local Next.js API routes backed by Supabase

export interface ApiErrorPayload {
  detail?: string
  error?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`/api${path}`, { ...init, headers, cache: 'no-store' })
  
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const payload = (await response.json()) as ApiErrorPayload
      if (payload.detail) message = payload.detail
      if (payload.error) message = payload.error
    } catch {
      // no-op
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export interface AuthUser {
  id: string
  email: string
  role: 'visitor' | 'organizer' | 'admin'
  organizer_verified: boolean
  created_at: string
  updated_at: string
}

export interface Place {
  id: number
  name: string
  description: string
  latitude: number
  longitude: number
  category: string
  theme: string
  images: string[]
  featured?: boolean
  created_at: string
  updated_at: string
}

function slugifyPlaceName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function buildPlacePath(place: Pick<Place, 'id' | 'name'>) {
  return `/place/${place.id}-${slugifyPlaceName(place.name)}`
}

export function resolvePlaceIdFromIdentifier(identifier: string) {
  const match = identifier.match(/^(\d+)(?:-|$)/)
  if (!match) return null
  const parsed = Number(match[1])
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export function identifierToPlaceKeyword(identifier: string) {
  return identifier.replace(/^\d+-?/, '').replace(/-/g, ' ').trim()
}

export interface Activity {
  id: number
  title: string
  description: string
  place_id: number
  place_name: string
  organizer_id: string
  date_time: string
  max_participants: number
  participants_count: number
  created_at: string
  updated_at: string
  mood: string | null
  visibility: string
  approval_status: string
  is_recurring: boolean
  recurrence_rule: string | null
  organizer_verified: boolean
}

export interface PaginatedResponse<T> {
  total: number
  page: number
  limit: number
  results: T[]
}

export interface ActivityCreatePayload {
  title: string
  description: string
  place_id: number
  date_time: string
  max_participants: number
}

export interface RecommendationPlace {
  id: number
  name: string
  category: string
  theme: string
  latitude: number
  longitude: number
  distance_km: number
  score: number
}

export interface RecommendationActivity {
  id: number
  title: string
  description: string
  place_id: number
  place_name: string
  place_category: string
  date_time: string
  max_participants: number
  participants_count: number
  available_slots: number
  is_joined: boolean
  distance_km: number
  score: number
}

export interface RecommendationsResponse {
  recommended_places: RecommendationPlace[]
  recommended_activities: RecommendationActivity[]
}

export function getPlaces(params: URLSearchParams) {
  return apiRequest<PaginatedResponse<Place>>(`/places?${params.toString()}`)
}

export function getPlace(placeId: number) {
  return apiRequest<Place>(`/places/${placeId}`)
}

export function getActivities(params: URLSearchParams) {
  return apiRequest<PaginatedResponse<Activity>>(`/activities?${params.toString()}`)
}

export function getMyActivities() {
  return apiRequest<Activity[]>('/users/me/activities')
}

export function joinActivity(activityId: number) {
  return apiRequest<{ user_id: string; activity_id: number; created_at: string }>(
    `/activities/${activityId}/join`,
    { method: 'POST' },
  )
}

export function createActivity(payload: ActivityCreatePayload) {
  return apiRequest<Activity>(
    '/activities',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

export function leaveActivity(activityId: number) {
  return apiRequest<void>(`/activities/${activityId}/leave`, { method: 'DELETE' })
}

export function getMe() {
  return apiRequest<AuthUser>('/auth/me')
}

// Recommendations - placeholder for now, can be implemented later with AI
export function getRecommendations(params: URLSearchParams) {
  // Return empty recommendations for now
  return Promise.resolve<RecommendationsResponse>({
    recommended_places: [],
    recommended_activities: [],
  })
}
