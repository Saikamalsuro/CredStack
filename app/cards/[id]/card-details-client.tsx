"use client"

import { useMemo, useState, useTransition } from "react"
import { addToWishlistAction, removeFromWishlistAction } from "@/app/dashboard/wishlist/actions"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Star, 
  Check, 
  Plane, 
  Gift, 
  Shield, 
  Fuel, 
  CreditCard as CreditCardIcon,
  Percent,
  Globe,
  AlertCircle,
  ExternalLink,
  GitCompare,
  History,
  Bookmark,
  BookmarkCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CreditCardVisual } from "@/components/cards/credit-card-visual"
import { CardGridItem } from "@/components/cards/card-grid-item"
import { OfferCard } from "@/components/offers/offer-card"
import type { CreditCard } from "@/lib/data/cards"
import type { Offer } from "@/lib/types/offers"
import {
  getApplyUrl,
  isInviteOnly,
  isDiscontinued,
} from "@/lib/data/card-apply-urls"

interface CardDetailsClientProps {
  card: CreditCard
  similarCards: CreditCard[]
  dataLastVerifiedAt?: string | null
  offers?: Offer[]
  isWishlisted?: boolean
}

type SimilarFilter =
  | "all"
  | "cat:premium"
  | "cat:travel"
  | "cat:cashback"
  | "cat:rewards"
  | "cat:shopping"
  | "cat:fuel"
  | "free"
  | "lounge"

const SIMILAR_FILTERS: { id: SimilarFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cat:premium", label: "Premium" },
  { id: "cat:travel", label: "Travel" },
  { id: "cat:cashback", label: "Cashback" },
  { id: "cat:rewards", label: "Rewards" },
  { id: "cat:shopping", label: "Shopping" },
  { id: "cat:fuel", label: "Fuel" },
  { id: "free", label: "Lifetime free" },
  { id: "lounge", label: "With lounge" },
]

function applySimilarFilter(cards: CreditCard[], filter: SimilarFilter): CreditCard[] {
  if (filter === "all") return cards
  if (filter === "free") return cards.filter((c) => c.annualFee === 0)
  if (filter === "lounge") return cards.filter((c) => c.loungeAccess !== null)
  const cat = filter.replace("cat:", "")
  return cards.filter((c) => c.category.includes(cat as CreditCard["category"][number]))
}

export function CardDetailsClient({ card, similarCards, dataLastVerifiedAt, offers = [], isWishlisted = false }: CardDetailsClientProps) {
  const [similarFilter, setSimilarFilter] = useState<SimilarFilter>("all")
  const [wishlisted, setWishlisted] = useState(isWishlisted)
  const [wishPending, startWishTransition] = useTransition()

  function toggleWishlist() {
    startWishTransition(async () => {
      if (wishlisted) {
        await removeFromWishlistAction(card.id)
        setWishlisted(false)
      } else {
        await addToWishlistAction(card.id)
        setWishlisted(true)
      }
    })
  }

  const filteredSimilar = useMemo(
    () => applySimilarFilter(similarCards, similarFilter),
    [similarCards, similarFilter]
  )

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const f of SIMILAR_FILTERS) {
      counts[f.id] = applySimilarFilter(similarCards, f.id).length
    }
    return counts
  }, [similarCards])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" asChild className="mb-6 -ml-2">
              <Link href="/cards">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cards
              </Link>
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Card visual */}
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CreditCardVisual card={card} size="lg" />
            </motion.div>

            {/* Card info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {card.featured && (
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                    Featured
                  </Badge>
                )}
                {card.category.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Badge>
                ))}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                {card.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">{card.issuer}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(card.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">{card.rating}</span>
                <span className="text-muted-foreground">
                  ({card.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Annual Fee</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {card.annualFee === 0 ? "FREE" : `₹${card.annualFee.toLocaleString()}`}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Rewards</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {card.rewards.rate}%
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Network</p>
                  <p className="text-xl font-bold text-foreground mt-1 uppercase">
                    {card.network}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Min Income</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {card.minIncome > 0 ? `₹${(card.minIncome / 100000).toFixed(0)}L` : "Any"}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-8">
                {(() => {
                  const applyUrl = getApplyUrl(card.id)
                  const invite = isInviteOnly(card.id)
                  const discontinued = isDiscontinued(card.id)

                  if (discontinued) {
                    return (
                      <Button size="lg" disabled className="bg-gradient-to-r from-primary to-accent opacity-60">
                        Not accepting applications
                      </Button>
                    )
                  }

                  if (!applyUrl) {
                    return (
                      <Button size="lg" disabled className="bg-gradient-to-r from-primary to-accent opacity-60">
                        Coming soon
                      </Button>
                    )
                  }

                  const label = invite ? "Express Interest" : "Apply Now"

                  return (
                    <Button
                      size="lg"
                      asChild
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    >
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${label} for ${card.name} (opens in new tab)`}
                      >
                        {label}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )
                })()}
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/cards/${card.id}/add`}>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Add to Portfolio
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/compare?cards=${card.id}`}>
                    <GitCompare className="h-4 w-4 mr-2" />
                    Add to Compare
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleWishlist}
                  disabled={wishPending}
                >
                  {wishlisted ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link href={`/cards/${card.id}/changes`}>
                    <History className="h-4 w-4 mr-2" />
                    Change history
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="fees">Fees & Charges</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Rewards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Rewards Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Percent className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {card.rewards.rate}% {card.rewards.type}
                        </p>
                        <p className="text-muted-foreground">{card.rewards.description}</p>
                      </div>
                    </div>
                    {card.welcomeBonus && (
                      <div className="bg-muted/50 rounded-lg p-4 mt-4">
                        <p className="text-sm font-medium text-foreground">Welcome Bonus</p>
                        <p className="text-sm text-muted-foreground mt-1">{card.welcomeBonus}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Benefits list */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Key Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {card.benefits.map((benefit, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="mt-0.5 p-1 bg-success/10 rounded-full shrink-0">
                            <Check className="h-4 w-4 text-success" />
                          </div>
                          <span className="text-foreground">{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Lounge access */}
                {card.loungeAccess && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5 text-primary" />
                        Lounge Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Domestic Lounges</p>
                          <p className="text-xl font-bold text-foreground mt-1">
                            {card.loungeAccess.domestic === "unlimited" 
                              ? "Unlimited" 
                              : `${card.loungeAccess.domestic} visits/year`}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">International Lounges</p>
                          <p className="text-xl font-bold text-foreground mt-1">
                            {card.loungeAccess.international === "unlimited" 
                              ? "Unlimited" 
                              : `${card.loungeAccess.international} visits/year`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick facts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Card Network</span>
                      <span className="font-medium text-foreground uppercase">{card.network}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fuel Surcharge Waiver</span>
                      <span className="font-medium text-foreground">
                        {card.fuelSurchargeWaiver ? "Yes" : "No"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Foreign Transaction Fee</span>
                      <span className="font-medium text-foreground">{card.foreignTransactionFee}%</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Interest Rate (APR)</span>
                      <span className="font-medium text-foreground">
                        {card.interestRate.min}% - {card.interestRate.max}%
                      </span>
                    </div>
                    {dataLastVerifiedAt && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Last verified</span>
                          <span className="font-medium text-foreground">
                            {new Date(dataLastVerifiedAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Credit limit */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5" />
                      Credit Limit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(card.creditLimit.min / 100000).toFixed(1)}L - ₹{(card.creditLimit.max / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on eligibility
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>All Benefits & Privileges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {card.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <div className="mt-0.5 p-1 bg-success/10 rounded-full shrink-0">
                        <Check className="h-4 w-4 text-success" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Fees & Charges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Joining Fee</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {card.joiningFee === 0 ? "FREE" : `₹${card.joiningFee.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Annual Fee</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {card.annualFee === 0 ? "FREE" : `₹${card.annualFee.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Interest Rate (APR)</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {card.interestRate.min}% - {card.interestRate.max}%
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Foreign Transaction Fee</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {card.foreignTransactionFee}%
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fuel Surcharge Waiver</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {card.fuelSurchargeWaiver ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-5 w-5 text-success" /> Yes
                        </span>
                      ) : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <Globe className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Minimum Annual Income</p>
                      <p className="text-muted-foreground mt-1">
                        {card.minIncome > 0 
                          ? `₹${card.minIncome.toLocaleString()} per annum` 
                          : "No minimum income requirement"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <CreditCardIcon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Credit Limit Range</p>
                      <p className="text-muted-foreground mt-1">
                        ₹{card.creditLimit.min.toLocaleString()} to ₹{card.creditLimit.max.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Important Note</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Actual eligibility depends on credit score, employment status, and other factors. 
                        The final credit limit is determined by the issuer based on your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Active offers */}
        {offers.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Active Offers
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Scraped from public bank and merchant sources. Verify on the issuer site before transacting.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {offers.length} offer{offers.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          </div>
        )}

        {/* Similar cards */}
        {similarCards.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Similar Cards You Might Like
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ranked by content similarity. Scroll horizontally to see more, or filter to narrow the list.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredSimilar.length} card{filteredSimilar.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {SIMILAR_FILTERS.map((f) => {
                const count = filterCounts[f.id] ?? 0
                const disabled = count === 0
                const active = similarFilter === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => !disabled && setSimilarFilter(f.id)}
                    disabled={disabled}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : disabled
                        ? "bg-muted/30 text-muted-foreground/50 border-border cursor-not-allowed"
                        : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1.5 opacity-70">{count}</span>
                  </button>
                )
              })}
            </div>
            {filteredSimilar.length > 0 ? (
              <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto pb-4 snap-x snap-mandatory">
                <div className="flex gap-6">
                  {filteredSimilar.map((similarCard, index) => (
                    <div
                      key={similarCard.id}
                      className="shrink-0 w-[280px] sm:w-[320px] snap-start"
                    >
                      <CardGridItem card={similarCard} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No similar cards match this filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
