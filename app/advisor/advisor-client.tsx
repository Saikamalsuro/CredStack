"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Loader2,
  ShoppingBag,
  Plane,
  Fuel,
  Utensils,
  Globe,
  Gift,
  Check,
  ArrowRight,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { CardGridItem } from "@/components/cards/card-grid-item"
import type { CreditCard } from "@/lib/data/cards"
import Link from "next/link"

interface AdvisorClientProps {
  allCards: CreditCard[]
}

const SPENDING_CATEGORIES = [
  { id: "shopping", label: "Online Shopping", hint: "Amazon, Flipkart, Myntra", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
  { id: "travel", label: "Travel & Hotels", hint: "Flights, hotels, vacation", icon: Plane, color: "bg-green-100 text-green-600" },
  { id: "fuel", label: "Fuel", hint: "Petrol, diesel pumps", icon: Fuel, color: "bg-orange-100 text-orange-600" },
  { id: "dining", label: "Dining & Food", hint: "Restaurants, Swiggy, Zomato", icon: Utensils, color: "bg-pink-100 text-pink-600" },
] as const

type CategoryId = (typeof SPENDING_CATEGORIES)[number]["id"]

interface SpendingProfile {
  shopping: number
  travel: number
  fuel: number
  dining: number
  monthlySpend: number
  preferFreeCards: boolean
  needsLoungeAccess: boolean
  prioritizeForex: boolean
  prioritizeWelcomeBonus: boolean
}

const DEFAULT_PROFILE: SpendingProfile = {
  shopping: 30,
  travel: 20,
  fuel: 25,
  dining: 25,
  monthlySpend: 50000,
  preferFreeCards: false,
  needsLoungeAccess: false,
  prioritizeForex: false,
  prioritizeWelcomeBonus: false,
}

const formatRupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`

export function AdvisorClient({ allCards }: AdvisorClientProps) {
  const [step, setStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<CreditCard[]>([])
  const [profile, setProfile] = useState<SpendingProfile>(DEFAULT_PROFILE)

  // Working state for step 1: rupee amount per category. Source of truth in step 1.
  // The submitted profile uses normalized %.
  const [rupees, setRupees] = useState<Record<CategoryId, number>>({
    shopping: Math.round(DEFAULT_PROFILE.monthlySpend * (DEFAULT_PROFILE.shopping / 100)),
    travel: Math.round(DEFAULT_PROFILE.monthlySpend * (DEFAULT_PROFILE.travel / 100)),
    fuel: Math.round(DEFAULT_PROFILE.monthlySpend * (DEFAULT_PROFILE.fuel / 100)),
    dining: Math.round(DEFAULT_PROFILE.monthlySpend * (DEFAULT_PROFILE.dining / 100)),
  })

  const totalAllocated = rupees.shopping + rupees.travel + rupees.fuel + rupees.dining
  const otherAmount = Math.max(0, profile.monthlySpend - totalAllocated)
  const overAllocated = totalAllocated > profile.monthlySpend

  const pct = useMemo(() => {
    const total = profile.monthlySpend || 1
    return {
      shopping: Math.round((rupees.shopping / total) * 100),
      travel: Math.round((rupees.travel / total) * 100),
      fuel: Math.round((rupees.fuel / total) * 100),
      dining: Math.round((rupees.dining / total) * 100),
    }
  }, [rupees, profile.monthlySpend])

  const setMonthlySpend = (val: number) => {
    setProfile((p) => ({ ...p, monthlySpend: val }))
  }

  const setCategoryRupees = (id: CategoryId, val: number) => {
    setRupees((r) => ({ ...r, [id]: val }))
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    const submitted: SpendingProfile = {
      ...profile,
      shopping: pct.shopping,
      travel: pct.travel,
      fuel: pct.fuel,
      dining: pct.dining,
    }
    setProfile(submitted)

    try {
      const res = await fetch("/api/advisor/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitted),
      })

      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations as CreditCard[])
          setIsAnalyzing(false)
          setStep(3)
          return
        }
      }
    } catch (err) {
      console.warn("[advisor] API call failed, falling back to local sort", err)
    }

    let recommended = [...allCards]
    if (submitted.preferFreeCards) recommended = recommended.filter((c) => c.annualFee === 0)
    if (submitted.needsLoungeAccess) recommended = recommended.filter((c) => c.loungeAccess !== null)
    if (submitted.prioritizeForex) {
      recommended = recommended.sort((a, b) => a.foreignTransactionFee - b.foreignTransactionFee)
    }
    recommended = recommended.sort((a, b) => {
      let scoreA = 0
      let scoreB = 0
      if (submitted.shopping > 30 && a.category.includes("shopping")) scoreA += 2
      if (submitted.shopping > 30 && b.category.includes("shopping")) scoreB += 2
      if (submitted.travel > 25 && a.category.includes("travel")) scoreA += 2
      if (submitted.travel > 25 && b.category.includes("travel")) scoreB += 2
      if (submitted.fuel > 25 && a.category.includes("fuel")) scoreA += 2
      if (submitted.fuel > 25 && b.category.includes("fuel")) scoreB += 2
      if (a.category.includes("cashback") && submitted.monthlySpend > 30000) scoreA += 1
      if (b.category.includes("cashback") && submitted.monthlySpend > 30000) scoreB += 1
      scoreA += a.rating * 2
      scoreB += b.rating * 2
      return scoreB - scoreA
    })

    setRecommendations(recommended.slice(0, 4))
    setIsAnalyzing(false)
    setStep(3)
  }

  const togglePreference = (key: keyof SpendingProfile) => {
    setProfile((p) => ({ ...p, [key]: !p[key as keyof SpendingProfile] }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-muted/30 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Credit Card Advisor
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us about your spending habits and preferences, and our AI will recommend
              the best credit cards tailored just for you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 rounded transition-colors ${
                  step > s ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Monthly Spending</CardTitle>
                  <CardDescription>
                    Enter how much you spend per month, then split it across categories. We do the percentages for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-foreground flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        Monthly card spend
                      </label>
                      <span className="text-sm text-muted-foreground">{formatRupees(profile.monthlySpend)}</span>
                    </div>
                    <Input
                      type="number"
                      min={1000}
                      step={1000}
                      value={profile.monthlySpend}
                      onChange={(e) => setMonthlySpend(Math.max(0, parseInt(e.target.value) || 0))}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-6 pt-4 border-t border-border">
                    {SPENDING_CATEGORIES.map((category) => {
                      const value = rupees[category.id]
                      const percent = pct[category.id]
                      return (
                        <div key={category.id} className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-lg shrink-0 ${category.color}`}>
                                <category.icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">{category.label}</p>
                                <p className="text-xs text-muted-foreground">{category.hint}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-foreground">{formatRupees(value)}</p>
                              <p className="text-xs text-muted-foreground">{percent}% of spend</p>
                            </div>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={([v]) => setCategoryRupees(category.id, v)}
                            max={Math.max(profile.monthlySpend, value)}
                            step={500}
                            className="w-full"
                          />
                        </div>
                      )
                    })}
                  </div>

                  <div className={`p-4 rounded-lg border text-sm ${
                    overAllocated
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-muted/40 text-muted-foreground border-border"
                  }`}>
                    {overAllocated ? (
                      <p>
                        <strong>Over-allocated:</strong> categories add up to {formatRupees(totalAllocated)} but monthly spend is {formatRupees(profile.monthlySpend)}. Reduce a slider or raise monthly spend.
                      </p>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <span>Other spends (utilities, groceries, etc.)</span>
                        <strong className="text-foreground">{formatRupees(otherAmount)}</strong>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full"
                      size="lg"
                      disabled={profile.monthlySpend < 1000 || overAllocated}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Preferences</CardTitle>
                  <CardDescription>
                    Pick the things that matter to you. Each toggle nudges the ranking.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      key: "preferFreeCards" as const,
                      icon: Wallet,
                      title: "No annual fee",
                      desc: "Show only lifetime free cards",
                    },
                    {
                      key: "needsLoungeAccess" as const,
                      icon: Plane,
                      title: "Airport lounge access",
                      desc: "Must include complimentary lounge visits",
                    },
                    {
                      key: "prioritizeForex" as const,
                      icon: Globe,
                      title: "Frequent international travel",
                      desc: "Prioritize cards with low forex markup",
                    },
                    {
                      key: "prioritizeWelcomeBonus" as const,
                      icon: Gift,
                      title: "Strong welcome bonus matters",
                      desc: "Favor cards with high joining benefits",
                    },
                  ].map((opt) => {
                    const active = profile[opt.key]
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        suppressHydrationWarning
                        onClick={() => togglePreference(opt.key)}
                        className={`w-full p-4 rounded-lg border text-left transition-colors ${
                          active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${
                            active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            <opt.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{opt.title}</p>
                            <p className="text-sm text-muted-foreground">{opt.desc}</p>
                          </div>
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            active ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {active && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                        </div>
                      </button>
                    )
                  })}

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleAnalyze} className="flex-1" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Get Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <Badge className="mb-4 bg-success/10 text-success border-success/20">
                  <Check className="h-3 w-3 mr-1" />
                  Analysis Complete
                </Badge>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Your Personalized Recommendations
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Based on your spending habits and preferences, here are our top picks for you
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {recommendations.map((card, index) => (
                  <CardGridItem key={card.id} card={card} index={index} />
                ))}
              </div>

              <details className="rounded-lg border bg-muted/30 p-4 text-sm">
                <summary className="cursor-pointer font-medium">
                  Show the math behind these recommendations
                </summary>
                <div className="pt-3 space-y-2 text-muted-foreground">
                  <p>
                    Rankings are computed deterministically. No money figure is
                    LLM-generated. We score each catalogue card on your inputs:
                  </p>
                  <ul className="space-y-1 pl-4 list-disc text-xs">
                    <li>
                      <strong className="text-foreground">Spend mix:</strong> categories you spend &gt;25-30% in
                      add +2 to cards that include that category.
                    </li>
                    <li>
                      <strong className="text-foreground">Monthly volume:</strong> &gt;₹30K/month favours cashback cards (+1).
                    </li>
                    <li>
                      <strong className="text-foreground">Rating:</strong> each star contributes 2 points.
                    </li>
                    <li>
                      <strong className="text-foreground">Hard filters:</strong> &quot;prefer free&quot; drops fee-bearing cards; &quot;needs lounge&quot; drops cards with no lounge entitlement; &quot;low forex&quot; sorts by forex markup ascending.
                    </li>
                  </ul>
                  <p className="text-xs">
                    Final return on your spend depends on transaction-level data. Use the Optimizer for per-merchant decisions.
                  </p>
                </div>
              </details>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => { setStep(1); setRecommendations([]) }}>
                  Start Over
                </Button>
                <Button asChild disabled={recommendations.length === 0}>
                  <Link href={`/compare?cards=${recommendations.map((c) => c.id).join(",")}`}>
                    Compare These Cards
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
