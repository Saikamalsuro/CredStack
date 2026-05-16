import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCardById } from "@/lib/db/cards"
import { getCardChanges, type CardChange } from "@/lib/db/card-changelog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarDays, ExternalLink, Clock, History } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

const CHANGE_TYPE_LABEL: Record<CardChange["change_type"], string> = {
  fee: "Fee",
  reward: "Rewards",
  benefit: "Benefits",
  eligibility: "Eligibility",
  discontinuation: "Discontinuation",
  other: "Other",
}

const CHANGE_TYPE_COLOR: Record<CardChange["change_type"], string> = {
  fee: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  reward: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  benefit: "bg-green-500/10 text-green-600 border-green-500/30",
  eligibility: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  discontinuation: "bg-red-500/10 text-red-600 border-red-500/30",
  other: "",
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const card = await getCardById(id)
  if (!card) return { title: "Not found | CredStack" }
  return {
    title: `${card.name} — change history | CredStack`,
    description: `Timeline of fee, reward, and benefit changes on ${card.name}. Verify before applying.`,
  }
}

export default async function CardChangesPage({ params }: Props) {
  const { id } = await params
  const card = await getCardById(id)
  if (!card) notFound()

  const changes = await getCardChanges(id)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={`/cards/${card.id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {card.name}
        </Link>
      </Button>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <History className="h-3.5 w-3.5" />
          Change history
        </div>
        <h1 className="text-3xl font-bold mb-2">{card.name}</h1>
        <p className="text-muted-foreground">
          Every fee, reward, and benefit change since this card joined our catalogue. We log what banks announce so you don&apos;t need to read the fine print.
        </p>
      </div>

      {changes.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-medium mb-2">No changes recorded</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This card hasn&apos;t had any tracked changes yet. We&apos;ll add an entry the next time the issuer announces a fee, reward, or benefit revision.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {changes.map((c, i) => (
            <Card key={`${c.date}-${i}`}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className={CHANGE_TYPE_COLOR[c.change_type]}>
                    {CHANGE_TYPE_LABEL[c.change_type]}
                  </Badge>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    Announced {formatDate(c.date)}
                  </div>
                  {c.effective_date && c.effective_date !== c.date && (
                    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Effective {formatDate(c.effective_date)}
                    </div>
                  )}
                </div>
                <CardTitle className="text-base leading-tight">{c.summary}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">{c.detail}</p>
                {c.source_url && (
                  <a
                    href={c.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-10 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Why this exists</CardTitle>
          <CardDescription>Banks often announce changes in small print or buried emails. CredStack surfaces them.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          If a card you hold gets a tracked change, we&apos;ll surface it on your dashboard the next time you visit. No alert emails unless you opt in.
        </CardContent>
      </Card>
    </div>
  )
}
