import { NextResponse } from 'next/server'
import { BACKEND_URL, getAuthToken } from '@/lib/server-api'

export async function GET(): Promise<NextResponse> {
  const token = await getAuthToken()
  if (!token) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 })
  }

  const backendRes = await fetch(`${BACKEND_URL}/users/me/activities`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data: unknown = await backendRes.json().catch(() => ([]))
  return NextResponse.json(data, { status: backendRes.status })
}
