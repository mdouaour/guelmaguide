import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const activityId = parseInt(id, 10)

  if (isNaN(activityId)) {
    return NextResponse.json({ error: 'Invalid activity ID' }, { status: 400 })
  }

  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if activity exists and has space
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select(`
      id,
      max_participants,
      activity_registrations(count)
    `)
    .eq('id', activityId)
    .single()

  if (activityError || !activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  const currentParticipants = activity.activity_registrations?.[0]?.count || 0

  if (currentParticipants >= activity.max_participants) {
    return NextResponse.json({ error: 'Activity is full' }, { status: 400 })
  }

  // Join the activity
  const { data, error } = await supabase
    .from('activity_registrations')
    .insert({
      user_id: user.id,
      activity_id: activityId,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already joined' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
