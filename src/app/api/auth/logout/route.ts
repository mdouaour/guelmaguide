import { NextResponse } from 'next/server'
import { clearAuthCookies, csrfError, validateCsrfToken } from '@/lib/server-api'

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await validateCsrfToken(request))) {
    return csrfError()
  }

  const response = NextResponse.json({ ok: true })
  clearAuthCookies(response)
  return response
}
