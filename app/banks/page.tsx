import type { Metadata } from "next"
import Link from "next/link"
import { getCards } from "@/lib/db/cards"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Banks — All Issuers | CredStack",
  description: "Browse credit, debit, and prepaid cards by issuer.",
}

export default async function BanksIndexPage() {
  const cards = await getCards()
  const issuers = [...new Set(cards.map((c) => c.issuer))].sort()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Building2 className="h-3.5 w-3.5" />
          Banks
        </div>
        <h1 className="text-3xl font-bold mb-2">Browse by bank</h1>
        <p className="text-muted-foreground">
          {issuers.length} issuers · {cards.length} credit cards + debit & prepaid (where available).
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {issuers.map((issuer) => {
          const count = cards.filter((c) => c.issuer === issuer).length
          const slug = issuer.toLowerCase().replace(/\s+/g, "-")
          return (
            <Link key={issuer} href={`/banks/${slug}`}>
              <Card className="hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{issuer}</p>
                    <p className="text-xs text-muted-foreground">
                      {count} credit card{count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
