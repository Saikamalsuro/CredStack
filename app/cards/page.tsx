"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CardGridItem } from "@/components/cards/card-grid-item"
import { CardFilters, CardFiltersSidebar } from "@/components/cards/card-filters"
import { 
  creditCards, 
  searchCards, 
  sortCards, 
  filterCards,
  type CardCategory,
  type CardNetwork 
} from "@/lib/data/cards"

export default function CardsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") as CardCategory | null

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<CardCategory[]>(
    initialCategory ? [initialCategory] : []
  )
  const [selectedNetworks, setSelectedNetworks] = useState<CardNetwork[]>([])
  const [maxAnnualFee, setMaxAnnualFee] = useState<number | null>(null)
  const [noAnnualFee, setNoAnnualFee] = useState(false)
  const [hasLoungeAccess, setHasLoungeAccess] = useState(false)
  const [sortBy, setSortBy] = useState<"rating" | "annualFee" | "rewards" | "name">("rating")

  // Filtered and sorted cards
  const filteredCards = useMemo(() => {
    let cards = creditCards

    // Search
    if (searchQuery.trim()) {
      cards = searchCards(searchQuery)
    }

    // Apply filters
    cards = filterCards(cards, {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      networks: selectedNetworks.length > 0 ? selectedNetworks : undefined,
      maxAnnualFee: maxAnnualFee ?? undefined,
      hasLoungeAccess: hasLoungeAccess || undefined,
      noAnnualFee: noAnnualFee || undefined,
    })

    // Sort
    cards = sortCards(cards, sortBy)

    return cards
  }, [searchQuery, selectedCategories, selectedNetworks, maxAnnualFee, noAnnualFee, hasLoungeAccess, sortBy])

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
              Explore Credit Cards
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Browse our comprehensive collection of credit cards. Filter by category, 
              network, fees, and more to find the perfect card for your needs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar filters */}
          <CardFiltersSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedNetworks={selectedNetworks}
            onNetworkChange={setSelectedNetworks}
            maxAnnualFee={maxAnnualFee}
            onMaxAnnualFeeChange={setMaxAnnualFee}
            noAnnualFee={noAnnualFee}
            onNoAnnualFeeChange={setNoAnnualFee}
            hasLoungeAccess={hasLoungeAccess}
            onHasLoungeAccessChange={setHasLoungeAccess}
          />

          {/* Cards grid */}
          <div className="flex-1">
            {/* Search and sort controls */}
            <CardFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              selectedNetworks={selectedNetworks}
              onNetworkChange={setSelectedNetworks}
              maxAnnualFee={maxAnnualFee}
              onMaxAnnualFeeChange={setMaxAnnualFee}
              noAnnualFee={noAnnualFee}
              onNoAnnualFeeChange={setNoAnnualFee}
              hasLoungeAccess={hasLoungeAccess}
              onHasLoungeAccessChange={setHasLoungeAccess}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCards={creditCards.length}
              filteredCount={filteredCards.length}
            />

            {/* Cards grid */}
            {filteredCards.length > 0 ? (
              <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCards.map((card, index) => (
                  <CardGridItem key={card.id} card={card} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                className="mt-12 text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-lg font-medium text-foreground">No cards found</p>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
