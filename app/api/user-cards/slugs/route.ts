import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/server'

export async function GET() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ slugs: [] })

  const { data, error } = await supabase
    .from('user_cards')
    .select('cards!inner(slug)')
    .eq('user_id', user.id)
    .is('removed_at', null)
  if (error) return NextResponse.json({ slugs: [], error: error.message }, { status: 500 })

  const slugs = (data ?? []).map((r) => (r.cards as unknown as { slug: string }).slug)
  return NextResponse.json({ slugs })
}
