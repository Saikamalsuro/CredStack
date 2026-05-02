"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Wallet, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RankItem {
  cardSlug: string
  cardName: string
  issuer: string
  rate: number
  reward: number
  reason: string
  cardColor: string
}

export default function OptimizerPage() {
  const [merchant, setMerchant] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ category: string; ranked: RankItem[] } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant, amount: Number(amount) }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Optimization failed")
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Trophy className="h-3 w-3 mr-1" />
            Card Use Optimizer
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Which card should I use for this purchase?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Enter the merchant and amount. We will rank every card by the rupee return
            on this single transaction — taking accelerated rates, caps, and exclusions
            into account.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>This transaction</CardTitle>
            <CardDescription>Where are you spending and how much?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="merchant">Merchant</Label>
                <Input
                  id="merchant"
                  placeholder="Amazon, Swiggy, Indian Oil..."
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="2500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="sm:col-span-3">
                {loading ? "Ranking..." : "Find best card"}
              </Button>
            </form>
            {error && (
              <div className="mt-4 text-sm bg-destructive/10 text-destructive rounded-md p-3 border border-destructive/20">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Best card for this purchase</CardTitle>
                  <CardDescription>
                    Modeled as <strong>{result.category}</strong> on ₹{Number(amount).toLocaleString()}
                  </CardDescription>
                </div>
                <TrendingUp className="h-6 w-6 text-success" />
              </CardHeader>
            </Card>

            {result.ranked.slice(0, 8).map((card, index) => (
              <Card key={card.cardSlug} className={index === 0 ? "border-success/50 bg-success/5" : ""}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`shrink-0 w-12 h-8 rounded bg-gradient-to-br ${card.cardColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {index === 0 && <Trophy className="inline h-4 w-4 text-success mr-1" />}
                      {card.cardName}
                    </p>
                    <p className="text-xs text-muted-foreground">{card.issuer} · {card.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-foreground">₹{card.reward}</p>
                    <p className="text-xs text-muted-foreground">return</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {result.ranked.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                No cards available
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
