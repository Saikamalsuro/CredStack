import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/db/server"
import { getCards } from "@/lib/db/cards"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in?redirect=/dashboard")
  }

  // Phase 1: mock-only userCards using top 3 cards from catalog.
  // Phase 2 swaps in getUserCards(user.id) with real user_cards rows.
  const cards = await getCards()
  const userCards = cards.slice(0, 3)

  return <DashboardClient userCards={userCards} />
}
