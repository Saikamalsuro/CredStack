"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard as CreditCardIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardVisual } from "@/components/cards/credit-card-visual"
import type { CreditCard } from "@/lib/data/cards"

interface AddCardFormProps {
  card: CreditCard
}

export function AddCardForm({ card }: AddCardFormProps) {
  const router = useRouter()
  const [lastFour, setLastFour] = useState("")
  const [statementDay, setStatementDay] = useState("1")
  const [dueDay, setDueDay] = useState("18")
  const [creditLimit, setCreditLimit] = useState("")
  const [nickname, setNickname] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/cards/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardSlug: card.id,
          lastFour,
          statementDay: Number(statementDay),
          dueDay: Number(dueDay),
          creditLimit: Number(creditLimit),
          nickname: nickname || undefined,
        }),
      })
      if (res.status === 401) {
        router.push(`/auth/sign-in?redirect=/cards/${card.id}/add`)
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Failed to add card")
      }
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed")
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link href={`/cards/${card.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to card
            </Link>
          </Button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Add to your portfolio</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            We use last four, statement and due dates only. Card numbers are never stored.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-start">
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="flex justify-center lg:justify-start">
            <CreditCardVisual card={card} size="md" />
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-semibold text-base text-foreground">{card.name}</p>
            <p>{card.issuer} · {card.network.toUpperCase()}</p>
            <p>{card.rewards.description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5 text-primary" />
              Card details
            </CardTitle>
            <CardDescription>Stored against your CredStack account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastFour">Last four digits</Label>
                <Input
                  id="lastFour"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  required
                  placeholder="1234"
                  value={lastFour}
                  onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statementDay">Statement day</Label>
                  <Input
                    id="statementDay"
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={statementDay}
                    onChange={(e) => setStatementDay(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDay">Due day</Label>
                  <Input
                    id="dueDay"
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit limit (₹)</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  min={0}
                  required
                  placeholder="500000"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname (optional)</Label>
                <Input
                  id="nickname"
                  maxLength={50}
                  placeholder="Travel card"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-sm bg-destructive/10 text-destructive rounded-md p-3 border border-destructive/20">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Adding..." : "Add to portfolio"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
