import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { getUpcomingPayments } from '@/lib/db/card-payments'

/**
 * GET /api/reminders/due
 * Returns upcoming card payments due in next 14 days for the authenticated user.
 * Designed for: in-app polling, Vercel cron forwarding to email, Inngest jobs.
 */
export async function GET() {
  const user = await requireAuth('/auth/sign-in')
  const upcoming = await getUpcomingPayments(user.id)

  const now = Date.now()
  const horizon = 14 * 24 * 60 * 60 * 1000
  const filtered = upcoming
    .filter((p) => {
      const due = new Date(p.dueDate).getTime()
      return due >= now && due - now <= horizon
    })
    .map((p) => {
      const due = new Date(p.dueDate).getTime()
      const daysLeft = Math.ceil((due - now) / (24 * 60 * 60 * 1000))
      return {
        cardName: p.cardName,
        dueDate: p.dueDate,
        amount: p.amount,
        minDue: p.minDue,
        daysLeft,
        severity: daysLeft <= 1 ? 'critical' : daysLeft <= 3 ? 'high' : daysLeft <= 7 ? 'medium' : 'low',
      }
    })

  return NextResponse.json({ reminders: filtered, generatedAt: new Date().toISOString() })
}
