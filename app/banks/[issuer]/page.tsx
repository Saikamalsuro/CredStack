import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCards } from "@/lib/db/cards"
import { getNonCreditCardsByIssuer } from "@/lib/db/non-credit-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, CreditCard, Wallet, Coins, ArrowRight } from "lucide-react"

interface Props {
  params: Promise<{ issuer: string }>
}

function decodeIssuer(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ")
}

function encodeIssuer(issuer: string): string {
  return issuer.toLowerCase().replace(/\s+/g, "-")
}

export async function generateStaticParams() {
  const cards = await getCards()
  const issuers = [...new Set(cards.map((c) => c.issuer))]
  return issuers.map((i) => ({ issuer: encodeIssuer(i) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { issuer } = await params
  const name = decodeIssuer(issuer)
  return {
    title: `${name} cards — Credit, Debit, Prepaid | CredStack`,
    description: `Full card portfolio from ${name}: credit cards, debit cards, prepaid cards.`,
  }
}

export default async function BankIssuerPage({ params }: Props) {
  const { issuer } = await params
  const issuerName = decodeIssuer(issuer)

  const allCards = await getCards()
  const credit = allCards.filter(
    (c) => c.issuer.toLowerCase() === issuerName.toLowerCase()
  )

  if (credit.length === 0) notFound()

  const exactIssuer = credit[0].issuer
  const nonCredit = await getNonCreditCardsByIssuer(exactIssuer)
  const debit = nonCredit.filter((c) => c.cardType === "debit")
  const prepaid = nonCredit.filter((c) => c.cardType === "prepaid")

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Building2 className="h-3.5 w-3.5" />
          Bank portfolio
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{exactIssuer}</h1>
        <p className="text-muted-foreground">
          Full card lineup — credit, debit, and prepaid variants in one view.
        </p>
      </div>

      <Section
        title="Credit cards"
        icon={CreditCard}
        count={credit.length}
        empty="No credit cards"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {credit.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className={`w-full h-3 rounded-full bg-gradient-to-r ${c.cardColor} mb-3`} />
                <Link href={`/cards/${c.id}`} className="font-medium hover:underline">
                  {c.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {c.annualFee === 0 ? "Lifetime free" : `₹${c.annualFee.toLocaleString("en-IN")}/yr`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Debit cards"
        icon={Wallet}
        count={debit.length}
        empty="Debit card data coming soon"
      >
        <NonCreditGrid cards={debit} />
      </Section>

      <Section
        title="Prepaid cards"
        icon={Coins}
        count={prepaid.length}
        empty="Prepaid card data coming soon"
      >
        <NonCreditGrid cards={prepaid} />
      </Section>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  count,
  empty,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  count: number
  empty: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">{title}</h2>
        <Badge variant="outline">{count}</Badge>
      </div>
      {count === 0 ? (
        <p className="text-sm text-muted-foreground italic">{empty}</p>
      ) : (
        children
      )}
    </section>
  )
}

function NonCreditGrid({ cards }: { cards: Awaited<ReturnType<typeof getNonCreditCardsByIssuer>> }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-4">
            <div className={`w-full h-3 rounded-full bg-gradient-to-r ${c.cardColorGradient || "from-muted to-muted-foreground"} mb-3`} />
            <div className="flex items-start gap-2 mb-2">
              <p className="font-medium flex-1">{c.name}</p>
              {c.dataPending && <Badge variant="outline" className="text-xs">verify</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {c.network.toUpperCase()} · {c.annualFee === 0 ? "Free" : `₹${c.annualFee}/yr`}
            </p>
            {c.keyFeatures.length > 0 && (
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                {c.keyFeatures.slice(0, 3).map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            )}
            {c.applyUrl && (
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <a href={c.applyUrl} target="_blank" rel="noopener noreferrer">
                  Apply <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
