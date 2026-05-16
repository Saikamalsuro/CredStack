import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Minus, ShieldCheck, Smartphone, Repeat, Eye } from "lucide-react"

export const metadata: Metadata = {
  title: "Virtual Credit Cards & Tokenization — Issuer Support (India) | CredStack",
  description:
    "Which Indian credit cards support virtual cards, tokenization, and disposable card numbers. Compare security features across HDFC, SBI, ICICI, Axis, Amex.",
}

interface VirtualCardSupport {
  issuer: string
  virtualCard: "yes" | "no" | "partial"
  tokenization: "yes" | "no"
  disposable: "yes" | "no"
  channel: string
  notes: string
}

const SUPPORT: VirtualCardSupport[] = [
  {
    issuer: "HDFC Bank",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "PayZapp app, NetBanking",
    notes: "PayZapp issues virtual cards instantly with custom limit. Tokenization on Visa/Mastercard via merchant checkout.",
  },
  {
    issuer: "SBI Card",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "SBI Card mobile app",
    notes: "SBI Card Virtual Card available for online purchases. Supports merchant-level tokenization.",
  },
  {
    issuer: "ICICI Bank",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "iMobile Pay app",
    notes: "Virtual card via iMobile with limit control; tokenization across major e-commerce merchants.",
  },
  {
    issuer: "Axis Bank",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "Axis Mobile app",
    notes: "Virtual Debit + Credit available. Tokenization standard on all Visa/Mastercard credit cards.",
  },
  {
    issuer: "American Express",
    virtualCard: "no",
    tokenization: "yes",
    disposable: "no",
    channel: "Amex App",
    notes: "No standalone virtual card, but supports Amex Token Service for online merchants and Apple/Samsung Pay.",
  },
  {
    issuer: "Kotak Mahindra Bank",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "Kotak 811 app",
    notes: "Virtual cards through 811 ecosystem; tokenization supported.",
  },
  {
    issuer: "IDFC FIRST Bank",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "IDFC FIRST Bank app",
    notes: "Instant virtual card on activation. Hide/show card details for security.",
  },
  {
    issuer: "OneCard",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "yes",
    channel: "OneCard app",
    notes: "Strongest in-class — generates disposable per-merchant numbers, freeze/unfreeze instantly, custom merchant categories.",
  },
  {
    issuer: "IndusInd Bank",
    virtualCard: "partial",
    tokenization: "yes",
    disposable: "no",
    channel: "IndusMobile app",
    notes: "Virtual variant available for selected card portfolios.",
  },
  {
    issuer: "RBL Bank",
    virtualCard: "partial",
    tokenization: "yes",
    disposable: "no",
    channel: "RBL MoBank app",
    notes: "Limited virtual card availability; tokenization standard.",
  },
  {
    issuer: "YES Bank",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "YES Mobile",
    notes: "YES Pay virtual card for online use. Tokenization fully supported.",
  },
  {
    issuer: "HSBC Bank India",
    virtualCard: "no",
    tokenization: "yes",
    disposable: "no",
    channel: "HSBC India app",
    notes: "Tokenization via merchant networks; no in-app virtual card issuance.",
  },
  {
    issuer: "AU Small Finance Bank",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "AU 0101 app",
    notes: "Virtual card on LIT and other co-branded cards; tokenization supported.",
  },
  {
    issuer: "Federal Bank / Scapia",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "Scapia app",
    notes: "Scapia issues virtual card instantly with toggle to enable/disable online transactions.",
  },
  {
    issuer: "Standard Chartered",
    virtualCard: "yes",
    tokenization: "yes",
    disposable: "no",
    channel: "SC Mobile app",
    notes: "Virtual card available for online-only spend with limit control.",
  },
  {
    issuer: "Bank of Baroda (BOBCARD)",
    virtualCard: "no",
    tokenization: "yes",
    disposable: "no",
    channel: "BOBCARD app",
    notes: "Tokenization for online merchants; no separate virtual variant.",
  },
]

function StatusCell({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes") return <Badge variant="default" className="bg-success/15 text-success hover:bg-success/15"><Check className="h-3 w-3 mr-1" />Yes</Badge>
  if (status === "partial") return <Badge variant="outline">Partial</Badge>
  return <Badge variant="outline" className="text-muted-foreground"><Minus className="h-3 w-3 mr-1" />No</Badge>
}

export default function VirtualCardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          Safety
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Virtual cards & tokenization support</h1>
        <p className="text-muted-foreground">
          Virtual card numbers shield your real card details from merchant breaches. Here&apos;s what each Indian issuer supports.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Virtual card</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            App-issued alternate number you use online. Real card stays private.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Repeat className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Tokenization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Merchants store a one-way token instead of your card number. RBI-mandated since 2022.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Disposable</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Single-use or per-merchant numbers that auto-expire. Strongest protection; rare in India.
          </CardContent>
        </Card>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Issuer comparison</CardTitle>
          <CardDescription>Current as of May 2026; tap an issuer for full notes</CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-2 sm:px-0 font-medium">Issuer</th>
                  <th className="py-3 px-2 font-medium">Virtual card</th>
                  <th className="py-3 px-2 font-medium">Tokenization</th>
                  <th className="py-3 px-2 font-medium">Disposable</th>
                  <th className="py-3 px-2 font-medium hidden md:table-cell">Channel</th>
                </tr>
              </thead>
              <tbody>
                {SUPPORT.map((s) => (
                  <tr key={s.issuer} className="border-b last:border-b-0 align-top">
                    <td className="py-3 px-2 sm:px-0 font-medium">{s.issuer}</td>
                    <td className="py-3 px-2"><StatusCell status={s.virtualCard} /></td>
                    <td className="py-3 px-2"><StatusCell status={s.tokenization} /></td>
                    <td className="py-3 px-2"><StatusCell status={s.disposable} /></td>
                    <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{s.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Detailed notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {SUPPORT.map((s) => (
            <div key={s.issuer} className="pb-3 border-b last:border-b-0 last:pb-0">
              <p className="font-medium mb-1">{s.issuer}</p>
              <p className="text-muted-foreground">{s.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Why this matters</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>• If a merchant&apos;s database leaks, only the token leaks — not your real card. Compromise scope drops to that merchant alone.</p>
          <p>• Virtual cards let you set a custom limit (e.g., ₹2,000) so subscription traps can&apos;t overcharge.</p>
          <p>• Tokenization is RBI-mandated for all online merchants — but enforcement is uneven. Check each merchant&apos;s checkout page.</p>
          <p>• OneCard&apos;s disposable numbers are the strongest consumer protection on the Indian market.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/safety/fraud-guide">Fraud response guide →</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cards">Browse cards</Link>
        </Button>
      </div>
    </div>
  )
}
