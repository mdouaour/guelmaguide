import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get activities the user has joined
  const { data, error } = await supabase
    .from('activity_registrations')
    .select(`
      activity_id,
      created_at,
      activities (
        *,
        places (name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform to expected format
  const activities = (data || []).map((reg) => {
    const activity = reg.activities as any
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      place_id: activity.place_id,
      place_name: activity.places?.name || '',
      organizer_id: activity.organizer_id,
      date_time: activity.date_time,
      max_participants: activity.max_participants,
      participants_count: 0, // Not needed for this view
      created_at: activity.created_at,
      updated_at: activity.updated_at,
      mood: activity.mood,
      visibility: activity.visibility,
      approval_status: activity.approval_status,
      is_recurring: activity.is_recurring,
      recurrence_rule: activity.recurrence_rule,
      organizer_verified: false,
    }
  })

  return NextResponse.json(activities)
}
