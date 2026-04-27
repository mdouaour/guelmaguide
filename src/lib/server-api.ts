import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function normalizeBackendUrl(value: string): string {
  const withoutTrailingSlashes = value.replace(/\/+$/, '')
  return withoutTrailingSlashes.endsWith('/api/v1')
    ? withoutTrailingSlashes
    : `${withoutTrailingSlashes}/api/v1`
}

export const BACKEND_URL = normalizeBackendUrl(
  process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:8000',
)

export const AUTH_COOKIE = 'auth_token'
export const CSRF_COOKIE = 'csrf_token'
export const IS_SECURE = process.env.NODE_ENV === 'production'

export async function validateCsrfToken(request: Request): Promise<boolean> {
  const headerToken = request.headers.get('X-CSRF-Token')
  if (!headerToken) return false
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  if (!cookieToken) return false
  return headerToken === cookieToken
}

export function csrfError(): NextResponse {
  return NextResponse.json({ detail: 'Invalid CSRF token' }, { status: 403 })
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE)?.value
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  csrfToken: string,
  maxAge: number,
): void {
  response.cookies.set(AUTH_COOKIE, accessToken, {
    httpOnly: true,
    secure: IS_SECURE,
    sameSite: 'strict',
    maxAge,
    path: '/',
  })
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: IS_SECURE,
    sameSite: 'strict',
    maxAge,
    path: '/',
  })
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: IS_SECURE,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  response.cookies.set(CSRF_COOKIE, '', {
    httpOnly: false,
    secure: IS_SECURE,
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
}
