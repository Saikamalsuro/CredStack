"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Check, AlertCircle, X } from "lucide-react"
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

interface EligibilityResult {
  slug: string
  name: string
  issuer: string
  annualFee: number
  cardColor: string
  status: "eligible" | "borderline" | "ineligible"
  reasons: string[]
}

export default function EligibilityPage() {
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [age, setAge] = useState("")
  const [creditScore, setCreditScore] = useState("")
  const [employmentType, setEmploymentType] = useState<string>("salaried")
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Eligibility Pre-Check
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Will you qualify for these cards?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Enter a few details. We will mark each card as eligible, borderline, or ineligible
            based on the published minimum criteria. Final approval still depends on the issuer.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>None of this is stored unless you sign in.</CardDescription>
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
              <Button type="submit" disabled={loading} className="sm:col-span-2">
                {loading ? "Checking..." : "Check eligibility"}
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
            {eligible.length > 0 && <ResultGroup title="Eligible" tone="success" cards={eligible} icon={Check} />}
            {borderline.length > 0 && <ResultGroup title="Borderline" tone="warning" cards={borderline} icon={AlertCircle} />}
            {ineligible.length > 0 && <ResultGroup title="Not eligible" tone="muted" cards={ineligible} icon={X} />}
          </motion.div>
        )}
      </div>
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
  tone: 'success' | 'warning' | 'muted'
  cards: EligibilityResult[]
  icon: React.ComponentType<{ className?: string }>
}) {
  const toneClass = tone === 'success' ? 'text-success bg-success/10' : tone === 'warning' ? 'text-warning bg-warning/10' : 'text-muted-foreground bg-muted/40'
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title} <span className="text-muted-foreground font-normal">({cards.length})</span></h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Card key={c.slug}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`shrink-0 w-12 h-8 rounded bg-gradient-to-br ${c.cardColor}`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{c.issuer} · ₹{c.annualFee.toLocaleString()}/yr</p>
                <ul className="space-y-1">
                  {c.reasons.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {r}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
