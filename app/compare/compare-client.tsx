"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  X,
  Check,
  Star,
  Plane,
  Search,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreditCardVisual } from "@/components/cards/credit-card-visual"
import type { CreditCard } from "@/lib/data/cards"
import { cn } from "@/lib/utils"
import Link from "next/link"

const MAX_COMPARE = 4

interface CompareClientProps {
  allCards: CreditCard[]
  netValues: Record<string, number>
}

const comparisonFeatures = [
  { key: "annualFee", label: "Annual Fee", format: (_: unknown, card: CreditCard) => card.annualFee === 0 ? "FREE" : `₹${card.annualFee.toLocaleString()}` },
  { key: "joiningFee", label: "Joining Fee", format: (_: unknown, card: CreditCard) => card.joiningFee === 0 ? "FREE" : `₹${card.joiningFee.toLocaleString()}` },
  { key: "netAnnualValue", label: "Net Annual Value", format: (_: unknown, card: CreditCard, ctx: { netValues: Record<string, number> }) => {
    const v = ctx.netValues[card.id]
    if (v === undefined) return "—"
    const sign = v >= 0 ? "+" : "-"
    return `${sign}₹${Math.abs(v).toLocaleString()}`
  } },
  { key: "rewardsRate", label: "Rewards Rate", format: (_: unknown, card: CreditCard) => `${card.rewards.rate}% ${card.rewards.type}` },
  { key: "welcomeBonus", label: "Welcome Bonus", format: (_: unknown, card: CreditCard) => card.welcomeBonus || "None" },
  { key: "loungeAccess", label: "Domestic Lounge", format: (_: unknown, card: CreditCard) =>
    card.loungeAccess ? (card.loungeAccess.domestic === "unlimited" ? "Unlimited" : `${card.loungeAccess.domestic}/year`) : "No"
  },
  { key: "intlLounge", label: "International Lounge", format: (_: unknown, card: CreditCard) =>
    card.loungeAccess ? (card.loungeAccess.international === "unlimited" ? "Unlimited" : `${card.loungeAccess.international}/year`) : "No"
  },
  { key: "foreignTxnFee", label: "Foreign Txn Fee", format: (_: unknown, card: CreditCard) => `${card.foreignTransactionFee}%` },
  { key: "fuelWaiver", label: "Fuel Surcharge Waiver", format: (_: unknown, card: CreditCard) => card.fuelSurchargeWaiver ? "Yes" : "No" },
  { key: "minIncome", label: "Min. Annual Income", format: (_: unknown, card: CreditCard) =>
    card.minIncome > 0 ? `₹${(card.minIncome / 100000).toFixed(0)}L` : "Any"
  },
  { key: "network", label: "Card Network", format: (_: unknown, card: CreditCard) => card.network.toUpperCase() },
  { key: "rating", label: "User Rating", format: (_: unknown, card: CreditCard) => `${card.rating}/5` },
]

export function CompareClient({ allCards, netValues }: CompareClientProps) {
  const searchParams = useSearchParams()
  const initialCardIds = searchParams.get("cards")?.split(",").filter(Boolean) || []

  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(
    initialCardIds.slice(0, MAX_COMPARE)
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const cardsBySlug = useMemo(() => {
    const map = new Map<string, CreditCard>()
    for (const c of allCards) map.set(c.id, c)
    return map
  }, [allCards])

  const selectedCards = useMemo(() =>
    selectedCardIds
      .map((id) => cardsBySlug.get(id))
      .filter((c): c is CreditCard => Boolean(c)),
    [selectedCardIds, cardsBySlug]
  )

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return allCards
    const query = searchQuery.toLowerCase()
    return allCards.filter((card) =>
      card.name.toLowerCase().includes(query) ||
      card.issuer.toLowerCase().includes(query)
    )
  }, [searchQuery, allCards])

  const addCard = (cardId: string) => {
    if (selectedCardIds.length < MAX_COMPARE && !selectedCardIds.includes(cardId)) {
      setSelectedCardIds([...selectedCardIds, cardId])
      setDialogOpen(false)
    }
  }

  const removeCard = (cardId: string) => {
    setSelectedCardIds(selectedCardIds.filter((id) => id !== cardId))
  }

  const getBestValue = (key: string): string[] => {
    if (selectedCards.length === 0) return []

    const cardValues = selectedCards.map((card) => {
      switch (key) {
        case "annualFee":
        case "joiningFee":
          return { id: card.id, value: card.annualFee, lower: true }
        case "netAnnualValue":
          return { id: card.id, value: netValues[card.id] ?? 0, lower: false }
        case "rewardsRate":
          return { id: card.id, value: card.rewards.rate, lower: false }
        case "foreignTxnFee":
          return { id: card.id, value: card.foreignTransactionFee, lower: true }
        case "minIncome":
          return { id: card.id, value: card.minIncome, lower: true }
        case "rating":
          return { id: card.id, value: card.rating, lower: false }
        default:
          return { id: card.id, value: 0, lower: false }
      }
    })

    const sortedByValue = [...cardValues].sort((a, b) =>
      a.lower ? a.value - b.value : b.value - a.value
    )

    const bestValue = sortedByValue[0]?.value
    return cardValues.filter((c) => c.value === bestValue).map((c) => c.id)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Compare Credit Cards
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Select up to {MAX_COMPARE} cards to compare features, fees, rewards,
              and benefits side by side.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Card selection slots */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AnimatePresence mode="popLayout">
            {selectedCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative overflow-hidden group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-7 w-7 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeCard(card.id)}
                    aria-label={`Remove ${card.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-4">
                    <div className="flex justify-center mb-3">
                      <CreditCardVisual card={card} size="sm" showDetails={false} />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground text-center truncate">
                      {card.name}
                    </h3>
                    <p className="text-xs text-muted-foreground text-center">{card.issuer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add card slots */}
          {Array.from({ length: MAX_COMPARE - selectedCards.length }).map((_, i) => (
            <Dialog key={`slot-${i}`} open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <motion.button
                  className="h-full min-h-[180px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Plus className="h-8 w-8" />
                  <span className="text-sm font-medium">Add Card</span>
                </motion.button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Select a Card to Compare</DialogTitle>
                  <DialogDescription>
                    Search and select a credit card to add to your comparison
                  </DialogDescription>
                </DialogHeader>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <ScrollArea className="h-[300px] mt-4">
                  <div className="space-y-2">
                    {filteredCards.map((card) => {
                      const isSelected = selectedCardIds.includes(card.id)
                      return (
                        <button
                          key={card.id}
                          type="button"
                          suppressHydrationWarning
                          onClick={() => !isSelected && addCard(card.id)}
                          disabled={isSelected}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                            isSelected
                              ? "border-primary/50 bg-primary/5 opacity-60 cursor-not-allowed"
                              : "border-border hover:border-primary hover:bg-muted/50"
                          )}
                        >
                          <div className={`w-12 h-8 rounded bg-gradient-to-br ${card.cardColor} shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{card.name}</p>
                            <p className="text-xs text-muted-foreground">{card.issuer}</p>
                          </div>
                          {isSelected && (
                            <Badge variant="secondary" className="shrink-0">Added</Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Comparison table */}
        {selectedCards.length > 0 ? (
          <motion.div
            className="bg-card border border-border rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid border-b border-border" style={{ gridTemplateColumns: `200px repeat(${selectedCards.length}, 1fr)` }}>
              <div className="p-4 bg-muted/50 font-semibold text-foreground">
                Feature
              </div>
              {selectedCards.map((card) => (
                <div key={card.id} className="p-4 text-center border-l border-border">
                  <Link
                    href={`/cards/${card.id}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {card.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{card.issuer}</p>
                </div>
              ))}
            </div>

            {comparisonFeatures.map((feature, index) => {
              const bestIds = getBestValue(feature.key)
              return (
                <div
                  key={feature.key}
                  className={cn(
                    "grid border-b border-border last:border-b-0",
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                  style={{ gridTemplateColumns: `200px repeat(${selectedCards.length}, 1fr)` }}
                >
                  <div className="p-4 font-medium text-foreground flex items-center">
                    {feature.label}
                  </div>
                  {selectedCards.map((card) => {
                    const isBest = bestIds.includes(card.id)
                    const value = feature.format(card[feature.key as keyof CreditCard] as never, card, { netValues })

                    return (
                      <div
                        key={card.id}
                        className={cn(
                          "p-4 text-center border-l border-border flex items-center justify-center",
                          isBest && "bg-success/5"
                        )}
                      >
                        <span className={cn(
                          "font-medium",
                          isBest ? "text-success" : "text-foreground"
                        )}>
                          {value}
                          {isBest && feature.key !== "network" && feature.key !== "welcomeBonus" && (
                            <Star className="inline-block h-3 w-3 ml-1 fill-success text-success" />
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })}

            <div
              className="grid border-b border-border bg-muted/20"
              style={{ gridTemplateColumns: `200px repeat(${selectedCards.length}, 1fr)` }}
            >
              <div className="p-4 font-medium text-foreground">Key Benefits</div>
              {selectedCards.map((card) => (
                <div key={card.id} className="p-4 border-l border-border">
                  <ul className="space-y-2">
                    {card.benefits.slice(0, 4).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className="grid"
              style={{ gridTemplateColumns: `200px repeat(${selectedCards.length}, 1fr)` }}
            >
              <div className="p-4 bg-muted/50"></div>
              {selectedCards.map((card) => (
                <div key={card.id} className="p-4 border-l border-border flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href={`/cards/${card.id}`}>
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Apply Now
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No cards selected</p>
            <p className="text-muted-foreground mt-2">
              Add at least 2 cards to start comparing features and benefits
            </p>
            <Button className="mt-6" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Card
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
