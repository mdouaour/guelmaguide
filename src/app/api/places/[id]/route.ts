import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const placeId = parseInt(id, 10)

  if (isNaN(placeId)) {
    return NextResponse.json({ error: 'Invalid place ID' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', placeId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
