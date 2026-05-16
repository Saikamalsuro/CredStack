import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ExternalLink, Landmark } from "lucide-react"

export const metadata: Metadata = {
  title: "RBI Credit Card Rule Updates — Cardholder Guide | CredStack",
  description:
    "Plain-English summaries of RBI circulars that affect Indian credit card holders. What changed, when it takes effect, what it means for you.",
}

interface RbiUpdate {
  date: string
  title: string
  summary: string
  impact: string
  source: string
  tag: "fees" | "rewards" | "regulation" | "security" | "consumer-protection"
}

const UPDATES: RbiUpdate[] = [
  {
    date: "2026-03-15",
    title: "BNPL classification under credit card framework",
    summary:
      "RBI clarified that Buy-Now-Pay-Later facilities offered by card issuers must follow the same disclosure norms as credit cards — APR, billing cycles, foreclosure terms.",
    impact:
      "BNPL on cards (HDFC Smart EMI, ICICI PayLater, Axis Freecharge Pay Later) now show consolidated APR up-front. Compare with regular EMI before opting in.",
    source: "RBI/2026-27/04",
    tag: "consumer-protection",
  },
  {
    date: "2026-02-12",
    title: "Wallet load surcharge clarification",
    summary:
      "RBI defined that issuers may charge a fee on wallet loads (Amazon Pay, Paytm, MobiKwik) above ₹5,000 per month. ICICI implemented a 1% fee starting Feb 2026.",
    impact:
      "Loading wallets via credit card no longer free above the cap. Use UPI for routine wallet top-ups; reserve cards for the first ₹5K each month.",
    source: "RBI/2026-27/02",
    tag: "fees",
  },
  {
    date: "2025-11-22",
    title: "Reward point expiry transparency",
    summary:
      "Banks must disclose reward point expiry dates and devaluation events at least 30 days in advance via SMS + email + statement.",
    impact:
      "Issuers can no longer silently devalue points. Track expiry via your card&apos;s app or CredStack&apos;s Reward Expiry tool.",
    source: "RBI/2025-26/108",
    tag: "consumer-protection",
  },
  {
    date: "2025-09-08",
    title: "Gaming MCC surcharge permitted",
    summary:
      "Issuers cleared to impose a 2% transaction fee on MCC 5816 (gaming, fantasy sports, online casinos). ICICI and HDFC rolled this out from Jan 2026.",
    impact:
      "Avoid using credit cards for Dream11, MPL, Rummy. Use UPI or debit if you do.",
    source: "RBI/2025-26/74",
    tag: "fees",
  },
  {
    date: "2025-06-30",
    title: "Card closure timelines",
    summary:
      "Banks must process closure requests within 7 working days of receiving a complete closure form. Failure attracts ₹500/day penalty payable to the customer.",
    impact:
      "If you close a card, file via written email AND track the 7-day window. Hold the bank accountable.",
    source: "RBI/2025-26/41",
    tag: "consumer-protection",
  },
  {
    date: "2024-12-04",
    title: "Tokenization mandatory for recurring payments",
    summary:
      "Saved card details for recurring payments (Netflix, Spotify, Amazon Prime) must be tokenized; merchants barred from storing raw card numbers.",
    impact:
      "All subscription merchants prompted re-authentication. Verify your tokenized card is set up correctly via merchant settings.",
    source: "RBI/2024-25/96",
    tag: "security",
  },
  {
    date: "2024-04-20",
    title: "Fuel surcharge waiver standardisation",
    summary:
      "RBI capped fuel surcharge waiver at ₹500/month per card; banks limited to ₹100/transaction waiver on transactions ₹400–₹4,000.",
    impact:
      "Fuel cashback / surcharge waiver figures are now standardised across banks. The waiver isn&apos;t the differentiator; the reward rate is.",
    source: "RBI/2024-25/22",
    tag: "fees",
  },
  {
    date: "2023-10-11",
    title: "Card-network neutrality",
    summary:
      "Issuers must let customers choose their card network (Visa / Mastercard / RuPay / Amex) at issuance, not default to one. Existing customers can request migration.",
    impact:
      "If you want RuPay (UPI support) instead of Visa, your bank is obliged to offer it on most card variants.",
    source: "RBI/2023-24/68",
    tag: "regulation",
  },
  {
    date: "2023-06-15",
    title: "Annual fee waiver communication",
    summary:
      "Banks must communicate annual fee waiver criteria at issuance and proactively notify when threshold is met or missed.",
    impact:
      "You should receive an SMS/email at 90% of waiver threshold reminding you to spend a bit more. Save the proof — it&apos;s evidence if waiver is denied.",
    source: "RBI/2023-24/22",
    tag: "consumer-protection",
  },
  {
    date: "2022-04-21",
    title: "Master Direction on Credit Card and Debit Card",
    summary:
      "Foundational RBI direction governing card issuance, closure, billing, dispute resolution, and consumer protection. Replaces 1980s-era guidelines.",
    impact:
      "Single authoritative source for all card rights. Bookmark it: rbi.org.in/Scripts/NotificationUser.aspx?Id=12300",
    source: "RBI/2022-23/12",
    tag: "regulation",
  },
]

const TAG_LABEL: Record<RbiUpdate["tag"], string> = {
  fees: "Fees",
  rewards: "Rewards",
  regulation: "Regulation",
  security: "Security",
  "consumer-protection": "Consumer Protection",
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export default function RbiUpdatesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Landmark className="h-3.5 w-3.5" />
          Regulatory feed
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">RBI rule updates for credit card holders</h1>
        <p className="text-muted-foreground">
          Plain-English summaries of regulatory changes that affect what you can do with your cards. New entries added when RBI publishes.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {UPDATES.map((u) => (
          <Card key={u.date + u.title}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline">{TAG_LABEL[u.tag]}</Badge>
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(u.date)}
                </div>
              </div>
              <CardTitle className="text-lg">{u.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Summary</p>
                <p>{u.summary}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">What it means for you</p>
                <p className="text-muted-foreground">{u.impact}</p>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Reference: {u.source}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stay informed</CardTitle>
          <CardDescription>Where to follow RBI announcements directly</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <a href="https://rbi.org.in/Scripts/NotificationList.aspx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">RBI Notifications page <ExternalLink className="h-3 w-3" /></a> — official feed of all circulars</p>
          <p>• <a href="https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">RBI Press Releases <ExternalLink className="h-3 w-3" /></a> — non-circular updates and FAQs</p>
          <p>• <a href="https://rbi.org.in/Scripts/Master_Directions.aspx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Master Directions <ExternalLink className="h-3 w-3" /></a> — consolidated rule books per topic</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/safety/fraud-guide">Fraud response →</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/safety/helplines">Helplines</Link>
        </Button>
      </div>
    </div>
  )
}
