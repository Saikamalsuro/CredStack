import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowRight } from "lucide-react"
import { REWARD_PROGRAMS } from "@/lib/data/reward-programs"

export const metadata: Metadata = {
  title: "Credit Card Rewards Programmes — Guide (India 2026) | CredStack",
  description:
    "How HDFC RPs, Amex MR, ICICI RPs, SBI RPs, Axis EDGE, Tata NeuCoins, 6E Rewards, and Maharaja Club really work. Earn rates, redemption ladders, transfer partners.",
}

export default function RewardsHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Trophy className="h-3.5 w-3.5" />
          Rewards programmes
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Indian credit card rewards — how each programme actually works</h1>
        <p className="text-muted-foreground">
          Every reward currency follows different rules: some give 1 RP = ₹1 only via certain portals, others transfer to airlines at 2-3× value. This is the cheat sheet.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {REWARD_PROGRAMS.map((p) => (
          <Card key={p.slug}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                <Badge variant="outline" className="shrink-0 text-xs">{p.issuer}</Badge>
              </div>
              <CardDescription className="text-sm">{p.blurb}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">Base earn</p>
                <p>{p.baseEarn}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">Best redemption</p>
                <p>{p.redemptionOptions[0].type}: <strong>{p.redemptionOptions[0].rate}</strong></p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/learn/rewards/${p.slug}`}>
                  Full guide
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Rule of thumb</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>Transferable points</strong> (Amex MR, HDFC Diners/Infinia, Axis EDGE Miles) are worth 2-3× the lowest published rate when used right.</p>
          <p>• <strong>Co-brand currencies</strong> (Tata NeuCoins, 6E Rewards) are pure 1:1 only inside their ecosystem. Worthless outside it.</p>
          <p>• <strong>Statement credit</strong> is usually the floor value. Use it only if vouchers and transfers aren&apos;t worth the friction.</p>
          <p>• <strong>Always factor expiry</strong>. SBI RPs expire in 2 years. Amex MR don&apos;t expire while account is active.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/tools/points-converter">Points value calculator →</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cards">Browse cards</Link>
        </Button>
      </div>
    </div>
  )
}
