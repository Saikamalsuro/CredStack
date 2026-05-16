import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/db/server"
import { getCards } from "@/lib/db/cards"
import { getUserCards } from "@/lib/db/user-cards"
import {
  getRecentTransactions,
  getMonthlySpending,
  getCategoryShare,
} from "@/lib/db/transactions"
import { getUpcomingPayments } from "@/lib/db/card-payments"
import { getRecentChangesForCards } from "@/lib/db/card-changelog"
import { DashboardClient } from "./dashboard-client"

function formatRelativeDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
}

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in?redirect=/dashboard")
  }

  const [userCardRows, recent, monthly, category, upcoming] = await Promise.all([
    getUserCards(user.id),
    getRecentTransactions(user.id, 5),
    getMonthlySpending(user.id, 6),
    getCategoryShare(user.id, 30),
    getUpcomingPayments(user.id),
  ])

  const userSlugs = userCardRows.map((u) => u.cardSlug)
  const recentChanges = await getRecentChangesForCards(userSlugs, 3)

  // Phase 2 fallback: if user has no real cards, show top 3 catalog cards as preview
  // so the dashboard isn't blank for first-time users.
  const userCards = userCardRows.length > 0
    ? userCardRows.map((u) => u.card)
    : (await getCards()).slice(0, 3)

  const recentTransactions = recent.map((t) => ({
    id: t.id,
    merchant: t.merchant,
    category: t.category,
    amount: t.amount,
    date: formatRelativeDate(t.date),
    cardName: t.cardName,
  }))

  const upcomingPayments = upcoming.map((p) => ({
    cardName: p.cardName,
    dueDate: p.dueDate,
    amount: p.amount,
    minDue: p.minDue,
  }))

  const totalSpending = monthly.reduce((s, m) => s + m.spending, 0)
  const totalRewards = monthly.reduce((s, m) => s + m.rewards, 0)

  return (
    <DashboardClient
      userCards={userCards}
      spendingData={monthly}
      categorySpending={category}
      recentTransactions={recentTransactions}
      upcomingPayments={upcomingPayments}
      recentChanges={recentChanges}
      totals={{
        totalSpending,
        totalRewards,
        activeCards: userCardRows.length,
        loungeVisits: 0,
      }}
    />
  )
}
