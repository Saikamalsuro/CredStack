import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { getUserCards } from '@/lib/db/user-cards'
import {
  getRecentTransactions,
  getMonthlySpending,
  getCategoryShare,
} from '@/lib/db/transactions'
import { getUpcomingPayments } from '@/lib/db/card-payments'

export async function GET() {
  const user = await requireAuth('/auth/sign-in')

  const [userCards, recentTransactions, spendingData, categorySpending, upcomingPayments] =
    await Promise.all([
      getUserCards(user.id),
      getRecentTransactions(user.id, 5),
      getMonthlySpending(user.id, 6),
      getCategoryShare(user.id, 30),
      getUpcomingPayments(user.id),
    ])

  const totalSpending = spendingData.reduce((s, m) => s + m.spending, 0)
  const totalRewards = spendingData.reduce((s, m) => s + m.rewards, 0)

  return NextResponse.json({
    userCards: userCards.map((u) => ({
      id: u.id,
      cardSlug: u.cardSlug,
      card: u.card,
      lastFour: u.cardLastFour,
      isPrimary: u.isPrimary,
    })),
    recentTransactions,
    spendingData,
    categorySpending,
    upcomingPayments,
    stats: {
      totalSpending,
      totalRewards,
      activeCards: userCards.length,
      loungeVisits: 0,
    },
  })
}
