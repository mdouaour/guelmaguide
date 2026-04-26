import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const date = searchParams.get('date')
  const place = searchParams.get('place')
  const availability = searchParams.get('availability')

  const offset = (page - 1) * limit

  const supabase = await createClient()

  // Get activities with place names and participant counts
  let query = supabase
    .from('activities')
    .select(`
      *,
      places!inner(name),
      activity_registrations(count)
    `, { count: 'exact' })
    .eq('visibility', 'public')
    .eq('approval_status', 'approved')

  if (date) {
    // Filter activities on or after the specified date
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`
    query = query.gte('date_time', startOfDay).lte('date_time', endOfDay)
  }

  if (place) {
    query = query.eq('place_id', parseInt(place, 10))
  }

  const { data, count, error } = await query
    .order('date_time', { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform the data to match the expected format
  const activities = (data || []).map((activity) => {
    const participantsCount = activity.activity_registrations?.[0]?.count || 0
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      place_id: activity.place_id,
      place_name: activity.places?.name || '',
      organizer_id: activity.organizer_id,
      date_time: activity.date_time,
      max_participants: activity.max_participants,
      participants_count: participantsCount,
      created_at: activity.created_at,
      updated_at: activity.updated_at,
      mood: activity.mood,
      visibility: activity.visibility,
      approval_status: activity.approval_status,
      is_recurring: activity.is_recurring,
      recurrence_rule: activity.recurrence_rule,
      organizer_verified: false, // TODO: join with profiles
    }
  })

  // Filter by availability if requested
  const filteredActivities = availability === 'true'
    ? activities.filter((a) => a.participants_count < a.max_participants)
    : activities

  return NextResponse.json({
    total: availability === 'true' ? filteredActivities.length : (count || 0),
    page,
    limit,
    results: filteredActivities,
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is organizer or admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || !['organizer', 'admin'].includes(profile.role)) {
    return NextResponse.json(
      { error: 'Only organizers can create activities' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { title, description, place_id, date_time, max_participants } = body

  if (!title || !description || !place_id || !date_time || !max_participants) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({
      title,
      description,
      place_id,
      organizer_id: user.id,
      date_time,
      max_participants,
      visibility: 'public',
      approval_status: 'approved',
    })
    .select(`*, places(name)`)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ...data,
    place_name: data.places?.name || '',
    participants_count: 0,
    organizer_verified: false,
  })
}
