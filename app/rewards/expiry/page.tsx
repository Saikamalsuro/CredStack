import type { Metadata } from "next"
import Link from "next/link"
import { Clock, AlertCircle, Sparkles } from "lucide-react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/helpers"
import { getUserCards } from "@/lib/db/user-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createPublicClient } from "@/lib/db/public-client"

export const metadata: Metadata = {
  title: "Reward Expiry Tracker | CredStack",
  description: "Track when reward points and cashback on each of your cards expire.",
}

interface CardExpiryRow {
  userCardId: string
  cardName: string
  issuer: string
  cardColor: string
  rewardType: string
  expiryMonths: number | null
  earliestExpiry: string | null
}

async function getExpiryRows(userId: string): Promise<CardExpiryRow[]> {
  const userCards = await getUserCards(userId)
  if (userCards.length === 0) return []

  const slugs = userCards.map((u) => u.cardSlug)
  const supabase = createPublicClient()
  const { data: meta } = await supabase
    .from("cards")
    .select("slug, reward_expiry_months, reward_type")
    .in("slug", slugs)

  const metaBySlug = new Map(
    (meta ?? []).map((m) => [m.slug, m]),
  )

  return userCards.map((u) => {
    const m = metaBySlug.get(u.cardSlug)
    const expiryMonths = m?.reward_expiry_months ?? null
    let earliestExpiry: string | null = null
    if (expiryMonths) {
      const d = new Date(u.addedAt)
      d.setMonth(d.getMonth() + expiryMonths)
      earliestExpiry = d.toISOString().slice(0, 10)
    }
    return {
      userCardId: u.id,
      cardName: u.card.name,
      issuer: u.card.issuer,
      cardColor: u.card.cardColor,
      rewardType: m?.reward_type ?? u.card.rewards.type,
      expiryMonths,
      earliestExpiry,
    }
  })
}

function urgencyTone(daysAway: number): { tone: 'success' | 'warning' | 'destructive'; label: string } {
  if (daysAway < 0) return { tone: 'destructive', label: 'Expired' }
  if (daysAway < 30) return { tone: 'destructive', label: 'Expires soon' }
  if (daysAway < 90) return { tone: 'warning', label: 'Approaching' }
  return { tone: 'success', label: 'Plenty of time' }
}

export default async function RewardExpiryPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/sign-in?redirect=/rewards/expiry")
  }

  const rows = await getExpiryRows(user.id)
  const today = new Date()

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Clock className="h-3 w-3 mr-1" />
            Reward Expiry Tracker
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            When do your rewards expire?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Each card has its own reward expiry policy. We highlight when redeemable
            points or cashback are at risk so you can use them before they vanish.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {rows.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No cards in your portfolio yet</p>
              <p className="mt-2 text-muted-foreground">
                Add a card to start tracking expiry dates.
              </p>
              <Button asChild className="mt-6">
                <Link href="/cards">Browse cards</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          rows.map((row) => {
            const urgent = row.earliestExpiry
              ? urgencyTone(Math.floor((new Date(row.earliestExpiry).getTime() - today.getTime()) / (24 * 60 * 60 * 1000)))
              : null
            return (
              <Card key={row.userCardId}>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`shrink-0 w-16 h-10 rounded bg-gradient-to-br ${row.cardColor}`} />
                    <div className="min-w-0">
                      <CardTitle className="truncate">{row.cardName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{row.issuer}</p>
                    </div>
                  </div>
                  {urgent && (
                    <Badge
                      variant={urgent.tone === 'destructive' ? 'destructive' : urgent.tone === 'warning' ? 'secondary' : 'default'}
                    >
                      {urgent.label}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {row.expiryMonths == null ? (
                    <div className="flex items-start gap-3 p-3 bg-success/5 rounded-md border border-success/20">
                      <Sparkles className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">No expiry on rewards</p>
                        <p className="text-muted-foreground">{row.cardName} {row.rewardType} never expire — redeem at your own pace.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                        <span className="text-muted-foreground">Expiry policy</span>
                        <span className="font-medium text-foreground">{row.expiryMonths} months from earning</span>
                      </div>
                      {row.earliestExpiry && (
                        <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md">
                          <span className="text-muted-foreground">Earliest expiry from this account</span>
                          <span className="font-medium text-foreground">
                            {new Date(row.earliestExpiry).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-md border border-warning/20">
                        <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">
                          We will surface per-transaction expiry once your statements are uploaded via the Analyzer.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
