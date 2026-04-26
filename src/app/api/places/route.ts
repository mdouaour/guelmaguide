import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const keyword = searchParams.get('keyword')
  const theme = searchParams.get('theme')
  const category = searchParams.get('category')

  const offset = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase.from('places').select('*', { count: 'exact' })

  if (keyword) {
    query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
  }

  if (theme) {
    query = query.ilike('theme', `%${theme}%`)
  }

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, count, error } = await query
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    total: count || 0,
    page,
    limit,
    results: data || [],
  })
}
