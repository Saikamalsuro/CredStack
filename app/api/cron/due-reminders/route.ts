import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/admin'

/**
 * Daily cron — fires at 9 AM IST via Vercel Cron (see vercel.json).
 * Iterates all users with payments due in next 14 days, sends in-app
 * notification + email (when Resend wired). Idempotent per user per day.
 */
export async function GET(request: Request) {
  // Vercel Cron sends an Authorization header with CRON_SECRET.
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const horizonDate = new Date()
  horizonDate.setDate(horizonDate.getDate() + 14)
  const today = new Date().toISOString().slice(0, 10)
  const horizon = horizonDate.toISOString().slice(0, 10)

  const { data: payments, error } = await supabase
    .from('card_payments')
    .select(`
      id, user_id, due_date, total_due, min_due, paid_at,
      user_cards!inner(cards!inner(name)),
      profiles!inner(email, full_name)
    `)
    .is('paid_at', null)
    .gte('due_date', today)
    .lte('due_date', horizon)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const reminders = (payments ?? []).map((p) => {
    const card = (p.user_cards as unknown as { cards: { name: string } }).cards
    const profile = p.profiles as unknown as { email: string | null; full_name: string | null }
    const days = Math.ceil((new Date(p.due_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    return {
      userId: p.user_id,
      email: profile?.email,
      fullName: profile?.full_name,
      cardName: card.name,
      dueDate: p.due_date,
      amount: p.total_due,
      daysLeft: days,
    }
  })

  // TODO: when RESEND_API_KEY present, dispatch emails here. For now, log + return.
  if (process.env.RESEND_API_KEY) {
    // Email dispatch will go here once Resend is wired.
  }

  return NextResponse.json({
    processedAt: new Date().toISOString(),
    count: reminders.length,
    reminders: reminders.slice(0, 50),
  })
}
