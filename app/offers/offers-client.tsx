'use client'

import { useMemo, useState } from 'react'
import { Tag, Search, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OfferCard } from '@/components/offers/offer-card'
import {
  OFFER_CATEGORY_LABELS,
  type Offer,
  type OfferCategory,
} from '@/lib/types/offers'

interface MerchantSummary {
  slug: string
  name: string
  category: OfferCategory
  popular: boolean
  count: number
}

interface CategorySummary {
  slug: OfferCategory
  label: string
  count: number
}

interface OffersClientProps {
  initialOffers: Offer[]
  categories: CategorySummary[]
  merchants: MerchantSummary[]
}

export function OffersClient({ initialOffers, categories, merchants }: OffersClientProps) {
  const [activeCategory, setActiveCategory] = useState<OfferCategory | 'all'>('all')
  const [activeMerchant, setActiveMerchant] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const FLASH_WINDOW_MS = 48 * 60 * 60 * 1000
    const now = Date.now()
    const matched = initialOffers.filter((o) => {
      if (activeCategory !== 'all' && o.category !== activeCategory) return false
      if (activeMerchant && o.merchantSlug !== activeMerchant) return false
      if (!q) return true
      const hay = [o.title, o.description ?? '', o.merchantName ?? '', ...o.eligibleIssuers]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
    // Flash offers (ending in <=48h) float to the top
    return matched.slice().sort((a, b) => {
      const aFlash = a.endsAt && new Date(a.endsAt).getTime() - now <= FLASH_WINDOW_MS && new Date(a.endsAt).getTime() > now
      const bFlash = b.endsAt && new Date(b.endsAt).getTime() - now <= FLASH_WINDOW_MS && new Date(b.endsAt).getTime() > now
      if (aFlash && !bFlash) return -1
      if (!aFlash && bFlash) return 1
      return 0
    })
  }, [initialOffers, activeCategory, activeMerchant, search])

  const popularMerchants = useMemo(
    () => merchants.filter((m) => m.popular).slice(0, 12),
    [merchants]
  )

  const categoriesWithCounts = useMemo(
    () => categories.filter((c) => c.count > 0).sort((a, b) => b.count - a.count),
    [categories]
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Tag className="h-3 w-3 mr-1" />
            Live offers
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Card Offers
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            Active offers scraped from bank hubs and aggregator sites. Refreshed weekly. Always
            verify on the issuer site before transacting.
          </p>

          <div className="mt-6 max-w-xl relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search merchant, issuer, or keyword"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            <CategoryChip
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              label="All"
              count={initialOffers.length}
            />
            {categoriesWithCounts.map((c) => (
              <CategoryChip
                key={c.slug}
                active={activeCategory === c.slug}
                onClick={() => setActiveCategory(c.slug)}
                label={c.label}
                count={c.count}
              />
            ))}
          </div>
        </section>

        {popularMerchants.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Popular merchants
            </h2>
            <div className="flex flex-wrap gap-2">
              <MerchantChip
                active={activeMerchant === null}
                onClick={() => setActiveMerchant(null)}
                label="All merchants"
              />
              {popularMerchants.map((m) => (
                <MerchantChip
                  key={m.slug}
                  active={activeMerchant === m.slug}
                  onClick={() => setActiveMerchant(m.slug === activeMerchant ? null : m.slug)}
                  label={m.name}
                  count={m.count}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              {filtered.length} offer{filtered.length === 1 ? '' : 's'}
              {activeCategory !== 'all' && (
                <span className="text-muted-foreground font-normal">
                  {' '}
                  · {OFFER_CATEGORY_LABELS[activeCategory]}
                </span>
              )}
            </h2>
            {(activeCategory !== 'all' || activeMerchant || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveCategory('all')
                  setActiveMerchant(null)
                  setSearch('')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16 space-y-3">
                <Sparkles className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">
                  {initialOffers.length === 0
                    ? 'No offers indexed yet'
                    : 'Nothing matches those filters'}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {initialOffers.length === 0
                    ? 'The scraper runs weekly. Check back after the next cron, or trigger one manually from /api/offers/scrape.'
                    : 'Try clearing filters or selecting a different category.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-8 max-w-3xl">
            Offers shown are scraped from public sources, refresh weekly to bi-weekly, and may have
            ended without notice. Always verify on the bank&apos;s website before making a purchase.
          </p>
        </section>
      </div>
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={onClick}
      className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-foreground border-border hover:bg-muted'
      }`}
    >
      <span>{label}</span>
      <span className={`text-xs ${active ? 'opacity-80' : 'text-muted-foreground'}`}>{count}</span>
    </button>
  )
}

function MerchantChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
}) {
  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={onClick}
      className={`cursor-pointer inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-foreground border-border hover:bg-muted'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={active ? 'opacity-80' : 'text-muted-foreground'}>· {count}</span>
      )}
    </button>
  )
}
