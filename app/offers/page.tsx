import type { Metadata } from "next"
import { Tag, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getActiveOffers } from "@/lib/db/offers"

export const revalidate = 1800

export const metadata: Metadata = {
  title: "Card Offers | CredStack",
  description: "Active credit card offers across major Indian merchants — Amazon, Flipkart, Swiggy, MakeMyTrip, Myntra.",
}

function discountText(o: { discountType: string; discountValue: number | null; maxDiscount: number | null }): string {
  if (!o.discountValue) return o.discountType
  switch (o.discountType) {
    case 'flat':
      return `Flat ₹${o.discountValue.toLocaleString()} off${o.maxDiscount ? ` (up to ₹${o.maxDiscount})` : ''}`
    case 'percent':
      return `${o.discountValue}% off${o.maxDiscount ? ` (max ₹${o.maxDiscount})` : ''}`
    case 'cashback':
      return `${o.discountValue}% cashback${o.maxDiscount ? ` (max ₹${o.maxDiscount})` : ''}`
    case 'instant':
      return `₹${o.discountValue.toLocaleString()} instant discount`
    default:
      return `${o.discountValue}`
  }
}

export default async function OffersPage() {
  const offers = await getActiveOffers()

  const byMerchant = new Map<string, typeof offers>()
  for (const o of offers) {
    const arr = byMerchant.get(o.merchant) ?? []
    arr.push(o)
    byMerchant.set(o.merchant, arr)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Tag className="h-3 w-3 mr-1" />
            Live Offers
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Card Offers</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Active credit card offers we have aggregated across major Indian merchants. Refreshed every 6 hours.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {offers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No active offers right now</p>
              <p className="mt-2 text-muted-foreground">
                Our scraper runs every 6 hours. New offers appear here automatically.
              </p>
            </CardContent>
          </Card>
        ) : (
          Array.from(byMerchant.entries()).map(([merchant, list]) => (
            <section key={merchant}>
              <h2 className="font-display text-2xl font-bold text-foreground capitalize mb-6">{merchant}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader>
                      <CardTitle className="text-base leading-snug">{offer.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm font-semibold text-success">{discountText(offer)}</p>
                      {offer.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{offer.description}</p>
                      )}
                      {offer.applicableIssuers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {offer.applicableIssuers.map((iss) => (
                            <Badge key={iss} variant="outline" className="text-xs">{iss}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                        <span>
                          {offer.minTxnAmount ? `Min ₹${offer.minTxnAmount.toLocaleString()}` : 'No minimum'}
                        </span>
                        <span>
                          {offer.validUntil ? `Until ${new Date(offer.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` : 'Ongoing'}
                        </span>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={offer.sourceUrl} target="_blank" rel="noreferrer">
                          View on {merchant}
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
