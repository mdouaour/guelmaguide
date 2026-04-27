import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL, getAuthToken } from '@/lib/server-api'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = await getAuthToken()

  const search = request.nextUrl.search
  const backendRes = await fetch(`${BACKEND_URL}/ai/recommendations${search}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  })

  const data: unknown = await backendRes.json().catch(() => ({}))
  return NextResponse.json(data, { status: backendRes.status })
}
