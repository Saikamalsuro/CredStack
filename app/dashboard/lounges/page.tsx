import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/db/server"
import { getUserCards } from "@/lib/db/user-cards"
import { getLoungeUsageByCard, getLoungeVisits } from "@/lib/db/lounge-visits"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"
import { LoungeLogForm } from "./lounge-log-form"
import { LoungeVisitList } from "./lounge-visit-list"

export const metadata: Metadata = {
  title: "Lounge Tracker | CredStack",
  description: "Track airport lounge visits against your card quotas.",
}

export default async function LoungesPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/lounges")

  const [userCards, usage, visits] = await Promise.all([
    getUserCards(user.id),
    getLoungeUsageByCard(user.id),
    getLoungeVisits(user.id, 50),
  ])

  const cardChoices = userCards.map((c) => ({
    id: c.id,
    label: c.nickname ?? c.card.name,
  }))

  const year = new Date().getFullYear()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Plane className="h-3.5 w-3.5" />
          Lounge tracker
        </div>
        <h1 className="text-3xl font-bold mb-2">Lounge access — {year}</h1>
        <p className="text-muted-foreground">
          Log every airport lounge visit. Stay ahead of quotas; never lose a benefit you paid for in the annual fee.
        </p>
      </div>

      {userCards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Plane className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium mb-2">Add a card first</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Lounge tracking attaches to cards in your portfolio. Add at least one to enable.
            </p>
            <Button asChild>
              <Link href="/cards">Browse catalogue</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {usage.map((u) => (
              <Card key={u.userCardId}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-14 h-9 rounded-md bg-gradient-to-br ${u.cardColor} shrink-0`}
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/cards/${u.cardSlug}`}
                        className="font-medium text-sm hover:underline truncate block"
                      >
                        {u.cardName}
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <QuotaRow label="Domestic" used={u.domesticUsed} quota={u.domesticQuota} />
                    <QuotaRow label="International" used={u.intlUsed} quota={u.intlQuota} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Log a visit</CardTitle>
              <CardDescription>Records lounge usage against the selected card</CardDescription>
            </CardHeader>
            <CardContent>
              <LoungeLogForm cards={cardChoices} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent visits</CardTitle>
              <CardDescription>{visits.length} total this year</CardDescription>
            </CardHeader>
            <CardContent>
              <LoungeVisitList visits={visits} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function QuotaRow({
  label,
  used,
  quota,
}: {
  label: string
  used: number
  quota: number | "unlimited" | null
}) {
  if (quota === null) {
    return (
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>No quota</span>
      </div>
    )
  }
  if (quota === "unlimited") {
    return (
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-success font-medium">{used} used · unlimited</span>
      </div>
    )
  }
  const remaining = Math.max(0, quota - used)
  const pct = quota > 0 ? Math.min(100, (used / quota) * 100) : 0
  const tone =
    remaining === 0
      ? "bg-destructive"
      : remaining <= Math.max(1, quota * 0.2)
        ? "bg-amber-500"
        : "bg-primary"
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used} / {quota}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
