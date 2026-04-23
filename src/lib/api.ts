function normalizeApiBaseUrl(value: string) {
  const withoutTrailingSlashes = value.replace(/\/+$/, '')
  return withoutTrailingSlashes.endsWith('/api/v1')
    ? withoutTrailingSlashes
    : `${withoutTrailingSlashes}/api/v1`
}

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1',
)

export interface ApiErrorPayload {
  detail?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, cache: 'no-store' })
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const payload = (await response.json()) as ApiErrorPayload
      if (payload.detail) message = payload.detail
    } catch {
      // no-op
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export interface AuthUser {
  id: number
  email: string
  role: 'visitor' | 'organizer' | 'admin'
  organizer_verified: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface RegisterResponse extends AuthResponse {
  user: AuthUser
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
  organizer_id: number
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

export function register(payload: { email: string; password: string }) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMe(token: string) {
  return apiRequest<AuthUser>('/auth/me', {}, token)
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

export function getMyActivities(token: string) {
  return apiRequest<Activity[]>('/users/me/activities', {}, token)
}

export function joinActivity(activityId: number, token: string) {
  return apiRequest<{ user_id: number; activity_id: number; created_at: string }>(
    `/activities/${activityId}/join`,
    { method: 'POST' },
    token,
  )
}

export function createActivity(payload: ActivityCreatePayload, token: string) {
  return apiRequest<Activity>(
    '/activities',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  )
}

export function leaveActivity(activityId: number, token: string) {
  return apiRequest<void>(`/activities/${activityId}/leave`, { method: 'DELETE' }, token)
}

export function getRecommendations(params: URLSearchParams, token?: string) {
  return apiRequest<RecommendationsResponse>(`/ai/recommendations?${params.toString()}`, {}, token)
}

export function getFeaturedPlaces() {
  return apiRequest<Place[]>('/places/featured')
}

export function requestPasswordReset(email: string) {
  return apiRequest<{ message: string; reset_token?: string }>(
    '/auth/request-password-reset',
    { method: 'POST', body: JSON.stringify({ email }) },
  )
}

export function resetPassword(token: string, newPassword: string) {
  return apiRequest<AuthResponse>(
    '/auth/reset-password',
    { method: 'POST', body: JSON.stringify({ token, new_password: newPassword }) },
  )
}

// Admin API
export type AdminActivity = Activity

export interface AdminUser {
  id: number
  email: string
  role: string
  organizer_verified: boolean
  created_at: string
  updated_at: string
}

export function adminGetUsers(token: string) {
  return apiRequest<AdminUser[]>('/admin/users', {}, token)
}

export function adminGetActivities(params: URLSearchParams, token: string) {
  return apiRequest<PaginatedResponse<Activity>>(`/admin/activities?${params.toString()}`, {}, token)
}

export function adminApproveActivity(activityId: number, token: string) {
  return apiRequest<Activity>(`/admin/activities/${activityId}/approve`, { method: 'PATCH' }, token)
}

export function adminRejectActivity(activityId: number, token: string) {
  return apiRequest<Activity>(`/admin/activities/${activityId}/reject`, { method: 'PATCH' }, token)
}

export function adminVerifyOrganizer(userId: number, token: string) {
  return apiRequest<AdminUser>(`/admin/users/${userId}/verify-organizer`, { method: 'PATCH' }, token)
}

export function adminPromoteUser(userId: number, token: string) {
  return apiRequest<AdminUser>(`/admin/users/${userId}/promote`, { method: 'PATCH' }, token)
}
