"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Calculator, TrendingDown, AlertCircle } from "lucide-react"

interface CardChoice {
  id: string
  name: string
  issuer: string
  aprMonthlyPct: number
}

function formatRupee(paise: number): string {
  return `₹${Math.round(paise).toLocaleString("en-IN")}`
}

function simulate({
  balance,
  monthlyRatePct,
  monthlyPayment,
  maxMonths = 240,
}: {
  balance: number
  monthlyRatePct: number
  monthlyPayment: number
  maxMonths?: number
}) {
  const rate = monthlyRatePct / 100
  const minPayment = balance * rate + 1
  const payment = Math.max(monthlyPayment, Math.ceil(minPayment))

  const rows: { month: number; balance: number; interest: number; principal: number; cumulativeInterest: number }[] = []
  let cur = balance
  let totalInterest = 0
  for (let m = 1; m <= maxMonths && cur > 0; m++) {
    const interest = cur * rate
    const principal = Math.min(payment - interest, cur)
    totalInterest += interest
    cur = Math.max(0, cur - principal)
    rows.push({
      month: m,
      balance: cur,
      interest,
      principal,
      cumulativeInterest: totalInterest,
    })
    if (principal <= 0) break
  }
  const months = rows.length
  const cleared = cur <= 0
  return { rows, totalInterest, months, cleared, effectivePayment: payment }
}

export function InterestCalculatorClient({ cards }: { cards: CardChoice[] }) {
  const [cardId, setCardId] = useState<string>(cards[0]?.id ?? "")
  const [balance, setBalance] = useState<number>(50000)
  const [payment, setPayment] = useState<number>(5000)

  const selected = useMemo(() => cards.find((c) => c.id === cardId), [cards, cardId])
  const apr = selected?.aprMonthlyPct ?? 3.5

  const sim = useMemo(
    () =>
      simulate({
        balance: Math.max(0, balance),
        monthlyRatePct: apr,
        monthlyPayment: Math.max(0, payment),
      }),
    [balance, apr, payment]
  )

  const fasterSim = useMemo(
    () =>
      simulate({
        balance: Math.max(0, balance),
        monthlyRatePct: apr,
        monthlyPayment: Math.max(0, payment) + Math.round(payment * 0.5),
      }),
    [balance, apr, payment]
  )
  const interestSaved = Math.max(0, sim.totalInterest - fasterSim.totalInterest)
  const monthsSaved = Math.max(0, sim.months - fasterSim.months)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Calculator className="h-3.5 w-3.5" />
          Free tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Credit card interest calculator</h1>
        <p className="text-muted-foreground">
          Carrying a balance? See exactly how long it takes to clear and how much you pay in
          interest. Uses each card&apos;s actual APR.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Adjust to see live impact</CardDescription>
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
              {selected && (
                <p className="text-xs text-muted-foreground">
                  APR (annualised): {(selected.aprMonthlyPct * 12).toFixed(1)}%
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Outstanding balance (₹)</Label>
              <Input
                id="balance"
                type="number"
                min={0}
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Monthly payment (₹)</Label>
              <Input
                id="payment"
                type="number"
                min={0}
                value={payment}
                onChange={(e) => setPayment(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Minimum due is roughly {formatRupee(balance * (apr / 100) + 1)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total interest paid</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatRupee(sim.totalInterest)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Months to clear</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{sim.cleared ? sim.months : `${sim.months}+`}</p>
                {!sim.cleared && (
                  <p className="text-xs text-muted-foreground mt-1">Payment too low — balance never clears at this rate</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total paid</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatRupee(balance + sim.totalInterest)}</p>
              </CardContent>
            </Card>
          </div>

          {sim.cleared && interestSaved > 0 && (
            <Card className="bg-success/5 border-success/30">
              <CardContent className="pt-6 flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    Pay ₹{Math.round(payment * 0.5).toLocaleString("en-IN")} more per month to save{" "}
                    {formatRupee(interestSaved)} in interest and finish {monthsSaved} months earlier.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!sim.cleared && (
            <Card className="bg-destructive/5 border-destructive/30">
              <CardContent className="pt-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm">
                  At ₹{payment.toLocaleString("en-IN")}/month, interest is growing faster than your
                  principal repayment. Pay at least {formatRupee(balance * (apr / 100) + 1000)}/month to make progress.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Principal vs interest over time</CardTitle>
              <CardDescription>How much of each payment kills the balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sim.rows}>
                    <defs>
                      <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v: number) => formatRupee(v)}
                      labelFormatter={(m) => `Month ${m}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#balanceGrad)"
                      name="Remaining balance"
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeInterest"
                      stroke="hsl(var(--destructive))"
                      fillOpacity={1}
                      fill="url(#interestGrad)"
                      name="Interest paid"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tools/emi-calculator">EMI calculator →</Link>
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
