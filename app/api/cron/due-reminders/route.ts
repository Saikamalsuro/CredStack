import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/admin'
import { sendDueReminderEmail, getResend } from '@/lib/email/resend'

/**
 * Daily cron — fires at 9 AM IST via Vercel Cron (see vercel.json).
 * Iterates all users with payments due in next 14 days, sends in-app
 * notification + email (when Resend wired). Idempotent per user per day.
 */
export async function GET(request: Request) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
  // Refuse to run if the secret is unset in production — open endpoint is worse than a missed run.
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
    }
    // dev only: allow without secret
  } else if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
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

  const emailResults: { userId: string; emailSent: boolean; error?: string }[] = []
  if (getResend()) {
    for (const r of reminders) {
      if (!r.email) {
        emailResults.push({ userId: r.userId, emailSent: false, error: 'no email on profile' })
        continue
      }
      const result = await sendDueReminderEmail({
        to: r.email,
        fullName: r.fullName,
        cardName: r.cardName,
        dueDate: r.dueDate,
        amount: r.amount,
        daysLeft: r.daysLeft,
      })
      emailResults.push({
        userId: r.userId,
        emailSent: !result.error,
        error: result.error,
      })
    }
  }

  return NextResponse.json({
    processedAt: new Date().toISOString(),
    count: reminders.length,
    emailsAttempted: emailResults.length,
    emailsSent: emailResults.filter((e) => e.emailSent).length,
    emailErrors: emailResults.filter((e) => e.error).map((e) => ({ userId: e.userId, error: e.error })),
    reminders: reminders.slice(0, 50),
  })
}
