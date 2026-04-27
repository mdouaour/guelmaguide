import { NextResponse } from 'next/server'
import { BACKEND_URL, setAuthCookies } from '@/lib/server-api'
import type { AuthUser } from '@/lib/api'

interface BackendRegisterResponse {
  user: AuthUser
  access_token: string
  token_type: string
  expires_in: number
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ detail: 'Invalid request body' }, { status: 400 })
  }

  const backendRes = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!backendRes.ok) {
    const error: unknown = await backendRes.json().catch(() => ({}))
    return NextResponse.json(error, { status: backendRes.status })
  }

  const data = (await backendRes.json()) as BackendRegisterResponse
  const csrfToken = crypto.randomUUID()

  const response = NextResponse.json({ user: data.user }, { status: 201 })
  setAuthCookies(response, data.access_token, csrfToken, data.expires_in)
  return response
}
