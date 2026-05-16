import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/db/server"
import { computeHealthScore } from "@/lib/db/health-score"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Heart, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Financial Health Score | CredStack",
  description: "A 0-100 score of your credit card health across utilisation, payment history, mix, optimisation, and forex.",
}

function tone(score: number, weight: number): { label: string; color: string } {
  const pct = (score / weight) * 100
  if (pct >= 80) return { label: "Strong", color: "text-success" }
  if (pct >= 50) return { label: "Healthy", color: "text-primary" }
  if (pct >= 25) return { label: "Watch", color: "text-amber-500" }
  return { label: "Risk", color: "text-destructive" }
}

function gaugeColor(total: number): string {
  if (total >= 80) return "stroke-success"
  if (total >= 60) return "stroke-primary"
  if (total >= 40) return "stroke-amber-500"
  return "stroke-destructive"
}

export default async function HealthScorePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/health-score")

  const score = await computeHealthScore(user.id)
  const circumference = 2 * Math.PI * 70
  const filled = (score.total / 100) * circumference

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Heart className="h-3.5 w-3.5" />
          Health score
        </div>
        <h1 className="text-3xl font-bold mb-2">Your credit card health</h1>
        <p className="text-muted-foreground">
          Composite score across 5 dimensions. This is your score — not the bank&apos;s. Focus on what&apos;s easiest to move first.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-48 h-48 shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="70" strokeWidth="14" fill="none" className="stroke-muted" />
              <circle
                cx="96"
                cy="96"
                r="70"
                strokeWidth="14"
                fill="none"
                className={gaugeColor(score.total)}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - filled}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-bold">{score.total}</p>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </div>
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-2xl font-bold">
              {score.total >= 80
                ? "Strong"
                : score.total >= 60
                  ? "Healthy"
                  : score.total >= 40
                    ? "Needs attention"
                    : "At risk"}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {score.total >= 60
                ? "You're using your cards well. Keep utilisation under 30% and stay on top of due dates."
                : "There are a few things to improve. The sub-scores below show what's moving the needle."}
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-sm">
              <Badge variant="outline">{score.cardCount} card{score.cardCount === 1 ? "" : "s"}</Badge>
              {score.totalLimit > 0 && (
                <Badge variant="outline">₹{score.totalLimit.toLocaleString("en-IN")} limit</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Sub-scores</h2>
      <div className="space-y-3 mb-10">
        {score.subscores.map((s) => {
          const t = tone(s.score, s.weight)
          const pct = (s.score / s.weight) * 100
          return (
            <Card key={s.key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {s.label}
                    <span className={`text-sm font-normal ${t.color}`}>{t.label}</span>
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {s.score}
                      <span className="text-sm font-normal text-muted-foreground">/{s.weight}</span>
                    </p>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={
                      pct >= 80
                        ? "h-full bg-success"
                        : pct >= 50
                          ? "h-full bg-primary"
                          : pct >= 25
                            ? "h-full bg-amber-500"
                            : "h-full bg-destructive"
                    }
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </CardHeader>
              {(s.helped.length > 0 || s.hurt.length > 0) && (
                <CardContent className="pt-0 grid sm:grid-cols-2 gap-3 text-sm">
                  {s.helped.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-success mb-1 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Helping
                      </p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        {s.helped.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {s.hurt.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-destructive mb-1 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" /> Hurting
                      </p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        {s.hurt.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
              {!s.hasData && (
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    Add more data for an accurate score here.
                  </p>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">How this score is computed</CardTitle>
          <CardDescription>Deterministic rules, no AI guessing on numbers.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>Utilisation (30 pts):</strong> Outstanding payments ÷ total credit limit. Under 30% is healthy.</p>
          <p>• <strong>Payment history (30 pts):</strong> On-time rate across last 12 months of due dates.</p>
          <p>• <strong>Card mix (15 pts):</strong> Number of cards in your portfolio (2-6 = sweet spot).</p>
          <p>• <strong>Reward optimisation (15 pts):</strong> Lounge usage vs annual quota across your cards.</p>
          <p>• <strong>Forex exposure (10 pts):</strong> % of recent spend on cards with ≥3% forex markup.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button asChild>
          <Link href="/dashboard/cards">Manage cards</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/lounges">Lounge tracker</Link>
        </Button>
      </div>
    </div>
  )
}
