import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
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

  // Leave the activity
  const { error } = await supabase
    .from('activity_registrations')
    .delete()
    .eq('user_id', user.id)
    .eq('activity_id', activityId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
