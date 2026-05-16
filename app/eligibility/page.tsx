"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, Check, AlertCircle, X, TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ApprovalOdds {
  score: number
  band: "high" | "medium" | "low"
  helped: string[]
  hurt: string[]
}

interface EligibilityResult {
  slug: string
  name: string
  issuer: string
  annualFee: number
  cardColor: string
  status: "eligible" | "borderline" | "ineligible"
  reasons: string[]
  approvalOdds: ApprovalOdds
}

export default function EligibilityPage() {
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [age, setAge] = useState("")
  const [creditScore, setCreditScore] = useState("")
  const [employmentType, setEmploymentType] = useState<string>("salaried")
  const [existingCards, setExistingCards] = useState<string>("")
  const [cityTier, setCityTier] = useState<string>("tier_1")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<EligibilityResult[] | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyIncome: Number(monthlyIncome),
          age: Number(age),
          creditScore: creditScore ? Number(creditScore) : undefined,
          employmentType,
          existingCards: existingCards === "" ? undefined : Number(existingCards),
          cityTier,
        }),
      })
      if (!res.ok) throw new Error("Check failed")
      const data = await res.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed")
    } finally {
      setLoading(false)
    }
  }

  const eligible = results?.filter((r) => r.status === "eligible") ?? []
  const borderline = results?.filter((r) => r.status === "borderline") ?? []
  const ineligible = results?.filter((r) => r.status === "ineligible") ?? []
  const topPicks = results
    ? [...results].filter((r) => r.status !== "ineligible").sort((a, b) => b.approvalOdds.score - a.approvalOdds.score).slice(0, 3)
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Eligibility & approval odds
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Will you qualify — and what are your odds?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            We check published minimums, then estimate the probability bank actually approves you. Estimates based on historical patterns, not bank decisions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>Optional fields improve the approval estimate. Nothing is stored.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income">Monthly income (₹)</Label>
                <Input
                  id="income"
                  type="number"
                  min="0"
                  placeholder="75000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="80"
                  placeholder="28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">CIBIL score (optional)</Label>
                <Input
                  id="score"
                  type="number"
                  min="300"
                  max="900"
                  placeholder="750"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp">Employment</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger id="emp">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self_employed">Self employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="existing">Existing credit cards (optional)</Label>
                <Input
                  id="existing"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="2"
                  value={existingCards}
                  onChange={(e) => setExistingCards(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City tier</Label>
                <Select value={cityTier} onValueChange={setCityTier}>
                  <SelectTrigger id="city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tier_1">Tier 1 (metros)</SelectItem>
                    <SelectItem value="tier_2">Tier 2</SelectItem>
                    <SelectItem value="tier_3">Tier 3 / rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={loading} className="sm:col-span-2">
                {loading ? "Checking..." : "Check eligibility & approval odds"}
              </Button>
            </form>
            {error && (
              <div className="mt-4 text-sm bg-destructive/10 text-destructive rounded-md p-3 border border-destructive/20">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {topPicks.length > 0 && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Most likely to be approved
                  </CardTitle>
                  <CardDescription>Top 3 by composite score (income, history, employment, CIBIL, city)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {topPicks.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/cards/${t.slug}`}
                        className="block p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                      >
                        <div className={`w-full h-2 rounded-full bg-gradient-to-r ${t.cardColor} mb-2`} />
                        <p className="font-medium text-sm leading-tight truncate">{t.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{t.issuer}</p>
                        <OddsBar odds={t.approvalOdds} />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {eligible.length > 0 && <ResultGroup title="Eligible" tone="success" cards={eligible} icon={Check} />}
            {borderline.length > 0 && <ResultGroup title="Borderline" tone="warning" cards={borderline} icon={AlertCircle} />}
            {ineligible.length > 0 && <ResultGroup title="Not eligible" tone="muted" cards={ineligible} icon={X} />}

            <p className="text-xs text-muted-foreground text-center pt-4">
              Estimates only. Banks use proprietary models and final approval depends on their internal review.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function OddsBar({ odds }: { odds: ApprovalOdds }) {
  const tone =
    odds.band === "high" ? "bg-success" : odds.band === "medium" ? "bg-amber-500" : "bg-destructive"
  const label =
    odds.band === "high" ? "High odds" : odds.band === "medium" ? "Medium odds" : "Low odds"
  return (
    <div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${odds.score}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {label} · {odds.score}/100
      </p>
    </div>
  )
}

function ResultGroup({
  title,
  tone,
  cards,
  icon: Icon,
}: {
  title: string
  tone: "success" | "warning" | "muted"
  cards: EligibilityResult[]
  icon: React.ComponentType<{ className?: string }>
}) {
  const toneClass =
    tone === "success"
      ? "text-success bg-success/10"
      : tone === "warning"
        ? "text-warning bg-warning/10"
        : "text-muted-foreground bg-muted/40"
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          {title} <span className="text-muted-foreground font-normal">({cards.length})</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Card key={c.slug}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className={`shrink-0 w-12 h-8 rounded bg-gradient-to-br ${c.cardColor}`} />
                <div className="flex-1 min-w-0">
                  <Link href={`/cards/${c.slug}`} className="font-semibold text-foreground hover:underline truncate block">
                    {c.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {c.issuer} · ₹{c.annualFee.toLocaleString()}/yr
                  </p>
                </div>
              </div>
              <OddsBar odds={c.approvalOdds} />
              {(c.approvalOdds.helped.length > 0 || c.approvalOdds.hurt.length > 0) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-medium text-success mb-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Helps
                    </p>
                    <ul className="space-y-0.5">
                      {c.approvalOdds.helped.map((h, i) => (
                        <li key={i} className="text-muted-foreground">• {h}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-destructive mb-1 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" /> Hurts
                    </p>
                    <ul className="space-y-0.5">
                      {c.approvalOdds.hurt.map((h, i) => (
                        <li key={i} className="text-muted-foreground">• {h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {c.reasons.length > 0 && (
                <ul className="space-y-0.5 pt-2 border-t">
                  {c.reasons.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {r}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
