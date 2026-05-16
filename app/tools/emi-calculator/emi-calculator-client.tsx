"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calculator, ShieldCheck, AlertTriangle } from "lucide-react"

interface CardChoice {
  id: string
  name: string
  issuer: string
  aprMonthlyPct: number
}

const TENURE_OPTIONS = [3, 6, 9, 12, 18, 24]

function rupee(v: number): string {
  return `₹${Math.round(v).toLocaleString("en-IN")}`
}

function emiAmount(principal: number, monthlyRate: number, tenureMonths: number): number {
  if (monthlyRate === 0) return principal / tenureMonths
  const r = monthlyRate
  const n = tenureMonths
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function EMICalculatorClient({ cards }: { cards: CardChoice[] }) {
  const [cardId, setCardId] = useState<string>(cards[0]?.id ?? "")
  const [amount, setAmount] = useState<number>(50000)
  const [tenure, setTenure] = useState<number>(12)
  const [processingFeePct, setProcessingFeePct] = useState<number>(1) // No-cost EMI usually 1% processing

  const card = useMemo(() => cards.find((c) => c.id === cardId), [cards, cardId])
  const apr = card?.aprMonthlyPct ?? 3.5

  const calc = useMemo(() => {
    const ratePct = apr / 100
    const interestEmi = emiAmount(amount, ratePct, tenure)
    const interestTotal = interestEmi * tenure
    const interestPaid = interestTotal - amount

    const processingFee = (amount * processingFeePct) / 100
    const gstOnFee = processingFee * 0.18
    const noCostEmiPayment = amount / tenure
    const noCostTotal = amount + processingFee + gstOnFee

    const effectiveRate =
      ((noCostTotal - amount) / amount) * (12 / tenure) * 100

    return {
      interestEmi,
      interestTotal,
      interestPaid,
      noCostEmiPayment,
      processingFee,
      gstOnFee,
      noCostTotal,
      effectiveRate,
      savings: interestTotal - noCostTotal,
    }
  }, [amount, tenure, apr, processingFeePct])

  const noCostWins = calc.savings > 0

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Calculator className="h-3.5 w-3.5" />
          Free tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">EMI calculator — no-cost vs interest</h1>
        <p className="text-muted-foreground">
          &quot;No-cost EMI&quot; usually still costs you — through processing fees and GST. See the real total.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Adjust to compare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="card">Card</Label>
              <Select value={cardId} onValueChange={setCardId}>
                <SelectTrigger id="card">
                  <SelectValue placeholder="Pick a card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.aprMonthlyPct}%/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {card && (
                <p className="text-xs text-muted-foreground">
                  APR (annualised): {(card.aprMonthlyPct * 12).toFixed(1)}%
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Purchase amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure</Label>
              <Select value={String(tenure)} onValueChange={(v) => setTenure(Number(v))}>
                <SelectTrigger id="tenure">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TENURE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={String(t)}>{t} months</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">No-cost EMI processing fee (%)</Label>
              <Input
                id="fee"
                type="number"
                min={0}
                step={0.5}
                value={processingFeePct}
                onChange={(e) => setProcessingFeePct(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Typical: 1–2% + 18% GST on the fee
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>No-cost EMI</CardDescription>
                <CardTitle className="text-2xl">{rupee(calc.noCostEmiPayment)}/mo</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Principal split</span><span>{rupee(amount / tenure)}/mo</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Processing fee</span><span>{rupee(calc.processingFee)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST on fee</span><span>{rupee(calc.gstOnFee)}</span></div>
                <div className="flex justify-between font-medium pt-2 border-t mt-2"><span>Total cost</span><span>{rupee(calc.noCostTotal)}</span></div>
                <div className="flex justify-between text-xs text-muted-foreground"><span>Effective interest rate</span><span>{calc.effectiveRate.toFixed(1)}% p.a.</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Interest-bearing EMI</CardDescription>
                <CardTitle className="text-2xl">{rupee(calc.interestEmi)}/mo</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Principal</span><span>{rupee(amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Interest paid</span><span>{rupee(calc.interestPaid)}</span></div>
                <div className="flex justify-between font-medium pt-2 border-t mt-2"><span>Total cost</span><span>{rupee(calc.interestTotal)}</span></div>
                <div className="flex justify-between text-xs text-muted-foreground"><span>APR</span><span>{(apr * 12).toFixed(1)}% p.a.</span></div>
              </CardContent>
            </Card>
          </div>

          <Card className={noCostWins ? "bg-success/5 border-success/30" : "bg-amber-500/5 border-amber-500/30"}>
            <CardContent className="pt-6 flex items-start gap-3">
              {noCostWins ? <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" /> : <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />}
              <div className="space-y-1">
                <p className="font-medium">
                  {noCostWins
                    ? `No-cost EMI saves you ${rupee(calc.savings)} vs the standard EMI on this card.`
                    : `The "no-cost" route actually costs ${rupee(Math.abs(calc.savings))} more here. Pay upfront or use the regular EMI.`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Effective rate on the no-cost option is {calc.effectiveRate.toFixed(1)}% p.a. once
                  processing fee and GST are factored in.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• Banks usually charge 1–2% processing fee + 18% GST on no-cost EMI. The discount you see is funded by this fee.</p>
              <p>• Always read the terms — some no-cost EMI offers exclude reward points on the purchase.</p>
              <p>• Pre-closure is allowed on most card EMIs but may attract foreclosure fees (2–3% of outstanding).</p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tools/interest-calculator">Interest calculator →</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cards">Browse cards</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
