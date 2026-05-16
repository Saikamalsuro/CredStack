import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { REWARD_PROGRAMS, getRewardProgram } from "@/lib/data/reward-programs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Clock, ArrowRightLeft, Wallet } from "lucide-react"

interface Props {
  params: Promise<{ program: string }>
}

export async function generateStaticParams() {
  return REWARD_PROGRAMS.map((p) => ({ program: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { program } = await params
  const p = getRewardProgram(program)
  if (!p) return { title: "Programme not found | CredStack" }
  return {
    title: `${p.name} — Guide | CredStack`,
    description: `${p.blurb} Earn rates, redemption ladder, transfer partners, and best uses.`,
  }
}

export default async function RewardProgramPage({ params }: Props) {
  const { program } = await params
  const p = getRewardProgram(program)
  if (!p) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/learn/rewards">
          <ArrowLeft className="h-4 w-4 mr-2" />
          All programmes
        </Link>
      </Button>

      <div className="mb-8">
        <Badge variant="outline" className="mb-3">{p.issuer}</Badge>
        <h1 className="text-3xl font-bold mb-3">{p.name}</h1>
        <p className="text-muted-foreground">{p.blurb}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" />
              Base earn
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">{p.baseEarn}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top categories</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">{p.topCategories}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Expiry
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">{p.expiryRule}</CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Redemption ladder</CardTitle>
          <CardDescription>Sorted top-down by value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {p.redemptionOptions.map((r, i) => (
              <div key={r.type} className={`flex items-start gap-3 p-3 rounded-md border ${i === 0 ? "border-success/50 bg-success/5" : ""}`}>
                <div className="text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-sm">{r.type}</p>
                    <p className="text-sm font-semibold text-primary">{r.rate}</p>
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {p.transferPartners && p.transferPartners.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              Transfer partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {p.transferPartners.map((tp) => (
                <div key={tp.name} className="flex justify-between p-2.5 rounded-md border text-sm">
                  <span>{tp.name}</span>
                  <span className="text-muted-foreground font-mono">{tp.ratio}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-success/5 border-success/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Best uses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {p.bestUses.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Watch-outs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {p.watchOuts.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cards in this programme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {p.cardSlugs.map((slug) => (
              <Button key={slug} asChild variant="outline" size="sm">
                <Link href={`/cards/${slug}`}>{slug.replace(/-/g, " ")}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/tools/points-converter">Calculate point value →</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/learn/rewards">All programmes</Link>
        </Button>
      </div>
    </div>
  )
}
