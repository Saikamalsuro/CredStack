"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  Send, 
  Loader2, 
  ShoppingBag, 
  Plane, 
  Fuel, 
  Utensils,
  Check,
  ArrowRight
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

const spendingCategories = [
  { id: "shopping", label: "Online Shopping", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
  { id: "travel", label: "Travel & Hotels", icon: Plane, color: "bg-green-100 text-green-600" },
  { id: "fuel", label: "Fuel", icon: Fuel, color: "bg-orange-100 text-orange-600" },
  { id: "dining", label: "Dining & Food", icon: Utensils, color: "bg-pink-100 text-pink-600" },
]

interface SpendingProfile {
  shopping: number
  travel: number
  fuel: number
  dining: number
  monthlySpend: number
  preferFreeCards: boolean
  needsLoungeAccess: boolean
}

export function AdvisorClient({ allCards }: AdvisorClientProps) {
  const [step, setStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<CreditCard[]>([])
  const [profile, setProfile] = useState<SpendingProfile>({
    shopping: 30,
    travel: 20,
    fuel: 25,
    dining: 25,
    monthlySpend: 50000,
    preferFreeCards: false,
    needsLoungeAccess: false,
  })

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    try {
      const res = await fetch('/api/advisor/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
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
      console.warn('[advisor] API call failed, falling back to local sort', err)
    }

    // Fallback: local heuristic over allCards
    let recommended = [...allCards]
    if (profile.preferFreeCards) recommended = recommended.filter((c) => c.annualFee === 0)
    if (profile.needsLoungeAccess) recommended = recommended.filter((c) => c.loungeAccess !== null)

    recommended = recommended.sort((a, b) => {
      let scoreA = 0
      let scoreB = 0
      if (profile.shopping > 30 && a.category.includes('shopping')) scoreA += 2
      if (profile.shopping > 30 && b.category.includes('shopping')) scoreB += 2
      if (profile.travel > 25 && a.category.includes('travel')) scoreA += 2
      if (profile.travel > 25 && b.category.includes('travel')) scoreB += 2
      if (profile.fuel > 25 && a.category.includes('fuel')) scoreA += 2
      if (profile.fuel > 25 && b.category.includes('fuel')) scoreB += 2
      if (a.category.includes('cashback') && profile.monthlySpend > 30000) scoreA += 1
      if (b.category.includes('cashback') && profile.monthlySpend > 30000) scoreB += 1
      scoreA += a.rating * 2
      scoreB += b.rating * 2
      return scoreB - scoreA
    })

    setRecommendations(recommended.slice(0, 4))
    setIsAnalyzing(false)
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        {/* Progress steps */}
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
          {/* Step 1: Spending breakdown */}
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
                  <CardTitle>Your Spending Breakdown</CardTitle>
                  <CardDescription>
                    Adjust the sliders to show how your spending is distributed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {spendingCategories.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <category.icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-foreground">{category.label}</span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {profile[category.id as keyof SpendingProfile]}%
                        </span>
                      </div>
                      <Slider
                        value={[profile[category.id as keyof SpendingProfile] as number]}
                        onValueChange={([value]) => setProfile({ ...profile, [category.id]: value })}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  ))}

                  <div className="pt-4 border-t border-border">
                    <Button onClick={() => setStep(2)} className="w-full" size="lg">
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Preferences */}
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
                    Help us understand what matters most to you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="font-medium text-foreground">Monthly Credit Card Spend</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={profile.monthlySpend}
                        onChange={(e) => setProfile({ ...profile, monthlySpend: parseInt(e.target.value) || 0 })}
                        className="flex-1"
                      />
                      <span className="text-muted-foreground">per month</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="font-medium text-foreground">Card Preferences</label>
                    <div className="space-y-3">
                      <button
                        onClick={() => setProfile({ ...profile, preferFreeCards: !profile.preferFreeCards })}
                        className={`w-full p-4 rounded-lg border text-left transition-colors ${
                          profile.preferFreeCards 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">No Annual Fee Cards Only</p>
                            <p className="text-sm text-muted-foreground">Show only lifetime free cards</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            profile.preferFreeCards ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {profile.preferFreeCards && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setProfile({ ...profile, needsLoungeAccess: !profile.needsLoungeAccess })}
                        className={`w-full p-4 rounded-lg border text-left transition-colors ${
                          profile.needsLoungeAccess 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">Airport Lounge Access Required</p>
                            <p className="text-sm text-muted-foreground">Must have complimentary lounge visits</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            profile.needsLoungeAccess ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}>
                            {profile.needsLoungeAccess && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

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

          {/* Step 3: Results */}
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => { setStep(1); setRecommendations([]) }}>
                  Start Over
                </Button>
                <Button asChild>
                  <Link href="/compare">
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
