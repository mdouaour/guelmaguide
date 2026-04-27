import { randomBytes, timingSafeEqual } from 'node:crypto'
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
// Allow explicit opt-in/out via COOKIE_SECURE env var; fall back to NODE_ENV === 'production'.
export const IS_SECURE =
  process.env.COOKIE_SECURE !== undefined
    ? process.env.COOKIE_SECURE !== 'false'
    : process.env.NODE_ENV === 'production'

/** Generate a cryptographically random 32-byte hex string for use as a CSRF token. */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

export async function validateCsrfToken(request: Request): Promise<boolean> {
  const headerToken = request.headers.get('X-CSRF-Token')
  if (!headerToken) return false
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  if (!cookieToken) return false
  // Use constant-time comparison to prevent timing attacks.
  if (headerToken.length !== cookieToken.length) return false
  return timingSafeEqual(Buffer.from(headerToken), Buffer.from(cookieToken))
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

export async function proxyJson(backendRes: Response): Promise<NextResponse> {
  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  let data: unknown
  try {
    data = await backendRes.json()
  } catch {
    return NextResponse.json(
      { detail: 'Invalid response from server' },
      { status: 502 },
    )
  }

  return NextResponse.json(data, { status: backendRes.status })
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
