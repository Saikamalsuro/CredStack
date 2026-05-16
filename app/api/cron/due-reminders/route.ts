import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/admin'
import { sendDueReminderEmail, getResend } from '@/lib/email/resend'

/**
 * Daily cron — fires at 9 AM IST via Vercel Cron (see vercel.json).
 * Iterates all users with payments due in next 14 days, sends in-app
 * notification + email (when Resend wired). Idempotent per (payment, IST day):
 * each card_payment row carries `last_reminded_on`. After a successful email
 * we stamp today's IST date; the cron filter excludes payments already
 * reminded today so duplicate firings (manual retry, double cron) are no-ops.
 */
const IST_OFFSET_MINUTES = 5 * 60 + 30

function nowInIst(): Date {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000
  return new Date(utc + IST_OFFSET_MINUTES * 60_000)
}

function istDateString(d: Date): string {
  // YYYY-MM-DD in IST. Used for `due_date` filtering and idempotency stamping.
  return d.toISOString().slice(0, 10)
}
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
  const ist = nowInIst()
  const today = istDateString(ist)
  const horizonDate = new Date(ist)
  horizonDate.setDate(horizonDate.getDate() + 14)
  const horizon = istDateString(horizonDate)

  const { data: payments, error } = await supabase
    .from('card_payments')
    .select(`
      id, user_id, due_date, total_due, min_due, paid_at, last_reminded_on,
      user_cards!inner(cards!inner(name)),
      profiles!inner(email, full_name)
    `)
    .is('paid_at', null)
    .gte('due_date', today)
    .lte('due_date', horizon)
    .or(`last_reminded_on.is.null,last_reminded_on.lt.${today}`)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const todayMs = new Date(`${today}T00:00:00Z`).getTime()
  const reminders = (payments ?? []).map((p) => {
    const card = (p.user_cards as unknown as { cards: { name: string } }).cards
    const profile = p.profiles as unknown as { email: string | null; full_name: string | null }
    const days = Math.ceil(
      (new Date(`${p.due_date}T00:00:00Z`).getTime() - todayMs) / (24 * 60 * 60 * 1000)
    )
    return {
      paymentId: p.id,
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
      if (!result.error) {
        await supabase
          .from('card_payments')
          .update({ last_reminded_on: today })
          .eq('id', r.paymentId)
      }
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
