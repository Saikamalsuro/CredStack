import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Check, X, Clock, Target, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Best First Credit Card in India 2026 — Beginner Guide | CredStack",
  description:
    "A complete guide to picking your first credit card in India. Eligibility, recommended starter cards, what to expect, and rookie mistakes to avoid.",
}

const STARTER_CARDS = [
  {
    slug: "idfc-wow",
    name: "IDFC FIRST WOW! Credit Card",
    why: "FD-backed, no income proof, lifetime free, zero forex markup",
    bestFor: "No credit history, students, first-jobbers",
    annualFee: "₹0 (lifetime free)",
  },
  {
    slug: "hdfc-moneyback-plus",
    name: "HDFC MoneyBack+ Credit Card",
    why: "Easy approval with stable salary; 5% on Amazon/Flipkart/Swiggy",
    bestFor: "Salaried first-timers with HDFC relationship",
    annualFee: "₹500 (waived on ₹50K spend)",
  },
  {
    slug: "sbi-simplyclick",
    name: "SimplyCLICK SBI Card",
    why: "Reliable for online shoppers; 10X points on partner apps",
    bestFor: "Heavy online spenders, students with PAN",
    annualFee: "₹499 (waived on ₹1L spend)",
  },
  {
    slug: "icici-platinum-chip",
    name: "ICICI Bank Platinum Chip Credit Card",
    why: "Low income threshold (₹2L), basic rewards, easy approval",
    bestFor: "Low-income applicants building credit",
    annualFee: "₹199",
  },
  {
    slug: "axis-myzone",
    name: "Axis Bank MyZone Credit Card",
    why: "Movie + dining + Swiggy perks; 4 lounge visits/year",
    bestFor: "Lifestyle-focused first-timers under 30",
    annualFee: "₹500 (waived on ₹50K spend)",
  },
  {
    slug: "amex-smart-earn",
    name: "Amex SmartEarn Credit Card",
    why: "10X points on Amazon/Flipkart/Uber/Swiggy/Zomato; brand value",
    bestFor: "Salaried ≥ ₹3.6L wanting Amex rewards ecosystem",
    annualFee: "₹495 (waived on ₹40K spend)",
  },
]

const NEED_SIGNALS = [
  "You have stable income and want to build credit history for future loans/cards",
  "You shop online regularly and want cashback/rewards on existing spend",
  "You want to separate personal and discretionary spending",
  "You travel occasionally and want lounge access or forex savings",
  "You need a payment fallback for emergencies",
]

const SKIP_SIGNALS = [
  "You can&apos;t pay the full bill every month — interest at 36-42% APR eats any rewards",
  "You&apos;re tempted to spend more because of available credit",
  "You don&apos;t have stable income yet — apply once you do",
  "You already have one and aren&apos;t using it strategically — add a second card only with purpose",
]

const FIRST_90_DAYS = [
  { day: "Day 1-3", action: "Card arrives. Activate via app or SMS. Set PIN. Add to mobile wallet (Apple/Google/Samsung Pay)." },
  { day: "Day 4-30", action: "Use for predictable spending only (groceries, online subscriptions). Avoid big-ticket purchases until you trust your repayment discipline." },
  { day: "Day 30-45", action: "First statement arrives. Verify every transaction. Pay total due (not minimum) before due date." },
  { day: "Day 60", action: "First credit score impact visible in CIBIL. Expect 700-740 if usage <30% and payment on time." },
  { day: "Day 90", action: "Decide: increase limit (request via app), add a 2nd category-specific card, or maintain. Don&apos;t apply for another card before 6 months." },
]

const MISTAKES = [
  "Paying only the minimum due — interest compounds at 3-3.5% per month",
  "Maxing out the credit limit — keep utilization under 30% for healthy CIBIL",
  "Closing your first card after upgrading — older accounts boost credit score",
  "Withdrawing cash from credit card — 2.5-3.5% transaction fee + interest from day one",
  "Ignoring the statement — fraudulent charges must be disputed within 3 working days for zero liability",
  "Applying for multiple cards in the same month — each application = hard CIBIL enquiry",
]

export default function FirstCardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <GraduationCap className="h-3.5 w-3.5" />
          Beginner guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Your first credit card — the honest guide</h1>
        <p className="text-muted-foreground">
          Picking your first credit card in India: when to get one, which to pick, and how to use it without regret.
        </p>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Do you need a credit card?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-3 text-success">Get one if:</p>
            <ul className="space-y-2">
              {NEED_SIGNALS.map((s) => (
                <li key={s} className="text-sm flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-3 text-destructive">Wait if:</p>
            <ul className="space-y-2">
              {SKIP_SIGNALS.map((s) => (
                <li key={s} className="text-sm flex items-start gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Best first credit cards in 2026</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {STARTER_CARDS.map((c) => (
          <Card key={c.slug}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base leading-tight">{c.name}</CardTitle>
              <Badge variant="outline" className="w-fit mt-1">{c.annualFee}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Why this card</p>
                <p>{c.why}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Best for</p>
                <p className="text-muted-foreground">{c.bestFor}</p>
              </div>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={`/cards/${c.slug}`}>View card details →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">What to expect — first 90 days</h2>
      <Card className="mb-12">
        <CardContent className="pt-6 space-y-4">
          {FIRST_90_DAYS.map((p) => (
            <div key={p.day} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 shrink-0 w-32">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{p.day}</span>
              </div>
              <p className="text-sm text-muted-foreground flex-1">{p.action}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Rookie mistakes to avoid</h2>
      <Card className="mb-12 bg-destructive/5 border-destructive/30">
        <CardContent className="pt-6">
          <ul className="space-y-3">
            {MISTAKES.map((m) => (
              <li key={m} className="text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <Button asChild>
            <Link href="/eligibility">Check eligibility</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/apply/documents">Documents needed</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools/interest-calculator">Interest calculator</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cards">Browse all 83 cards</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
