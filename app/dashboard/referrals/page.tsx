import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/db/server"
import { listReferrals } from "@/lib/db/referrals"
import { getCards } from "@/lib/db/cards"
import { ReferralsClient } from "./referrals-client"
import { Gift } from "lucide-react"

export const metadata: Metadata = {
  title: "Referral Tracker | CredStack",
  description: "Track credit card referrals and pending bonuses.",
}

export default async function ReferralsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/referrals")

  const [referrals, cards] = await Promise.all([listReferrals(user.id), getCards()])

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Gift className="h-3.5 w-3.5" />
          Referral tracker
        </div>
        <h1 className="text-3xl font-bold mb-2">Referrals & bonuses</h1>
        <p className="text-muted-foreground">
          Log every referral you make. Mark bonuses as credited when banks pay out.
        </p>
      </div>

      <ReferralsClient
        initial={referrals}
        cards={cards.map((c) => ({ slug: c.id, name: c.name }))}
      />
    </div>
  )
}
