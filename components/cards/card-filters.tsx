"use client"

import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { CardCategory, CardNetwork, CardTier } from "@/lib/data/cards"

interface CardFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategories: CardCategory[]
  onCategoryChange: (categories: CardCategory[]) => void
  selectedNetworks: CardNetwork[]
  onNetworkChange: (networks: CardNetwork[]) => void
  selectedTiers: CardTier[]
  onTierChange: (tiers: CardTier[]) => void
  maxAnnualFee: number | null
  onMaxAnnualFeeChange: (fee: number | null) => void
  noAnnualFee: boolean
  onNoAnnualFeeChange: (value: boolean) => void
  hasLoungeAccess: boolean
  onHasLoungeAccessChange: (value: boolean) => void
  sortBy: "rating" | "annualFee" | "rewards" | "name"
  onSortChange: (sort: "rating" | "annualFee" | "rewards" | "name") => void
  totalCards: number
  filteredCount: number
}

const tiers: { value: CardTier; label: string }[] = [
  { value: "entry", label: "Entry" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "premium", label: "Premium" },
  { value: "super_premium", label: "Super premium" },
  { value: "secured", label: "Secured (FD-backed)" },
  { value: "student", label: "Student" },
]

const categories: { value: CardCategory; label: string }[] = [
  { value: "travel", label: "Travel" },
  { value: "cashback", label: "Cashback" },
  { value: "rewards", label: "Rewards" },
  { value: "premium", label: "Premium" },
  { value: "business", label: "Business" },
  { value: "student", label: "Student" },
  { value: "fuel", label: "Fuel" },
  { value: "shopping", label: "Shopping" },
]

const networks: { value: CardNetwork; label: string }[] = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "rupay", label: "RuPay" },
]

const feeOptions = [
  { value: "any", label: "Any" },
  { value: "0", label: "Free (₹0)" },
  { value: "1000", label: "Up to ₹1,000" },
  { value: "2500", label: "Up to ₹2,500" },
  { value: "5000", label: "Up to ₹5,000" },
  { value: "10000", label: "Up to ₹10,000" },
]

export function CardFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedNetworks,
  onNetworkChange,
  maxAnnualFee,
  onMaxAnnualFeeChange,
  noAnnualFee,
  onNoAnnualFeeChange,
  hasLoungeAccess,
  onHasLoungeAccessChange,
  sortBy,
  onSortChange,
  totalCards,
  filteredCount,
}: CardFiltersProps) {
  const activeFilterCount = 
    selectedCategories.length + 
    selectedNetworks.length + 
    (maxAnnualFee ? 1 : 0) + 
    (noAnnualFee ? 1 : 0) + 
    (hasLoungeAccess ? 1 : 0)

  const clearAllFilters = () => {
    onCategoryChange([])
    onNetworkChange([])
    onMaxAnnualFeeChange(null)
    onNoAnnualFeeChange(false)
    onHasLoungeAccessChange(false)
    onSearchChange("")
  }

  const toggleCategory = (category: CardCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const toggleNetwork = (network: CardNetwork) => {
    if (selectedNetworks.includes(network)) {
      onNetworkChange(selectedNetworks.filter((n) => n !== network))
    } else {
      onNetworkChange([...selectedNetworks, network])
    }
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-medium text-sm text-foreground mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => toggleCategory(category.value)}
              />
              <Label
                htmlFor={`category-${category.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Networks */}
      <div>
        <h4 className="font-medium text-sm text-foreground mb-3">Card Network</h4>
        <div className="space-y-2">
          {networks.map((network) => (
            <div key={network.value} className="flex items-center space-x-2">
              <Checkbox
                id={`network-${network.value}`}
                checked={selectedNetworks.includes(network.value)}
                onCheckedChange={() => toggleNetwork(network.value)}
              />
              <Label
                htmlFor={`network-${network.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {network.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Annual Fee */}
      <div>
        <h4 className="font-medium text-sm text-foreground mb-3">Annual Fee</h4>
        <Select
          value={noAnnualFee ? "0" : maxAnnualFee?.toString() || "any"}
          onValueChange={(value) => {
            if (value === "any") {
              onMaxAnnualFeeChange(null)
              onNoAnnualFeeChange(false)
            } else if (value === "0") {
              onNoAnnualFeeChange(true)
              onMaxAnnualFeeChange(null)
            } else {
              onNoAnnualFeeChange(false)
              onMaxAnnualFeeChange(parseInt(value))
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select fee range" />
          </SelectTrigger>
          <SelectContent>
            {feeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Filters */}
      <div>
        <h4 className="font-medium text-sm text-foreground mb-3">Features</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lounge-access"
              checked={hasLoungeAccess}
              onCheckedChange={(checked) => onHasLoungeAccessChange(checked as boolean)}
            />
            <Label htmlFor="lounge-access" className="text-sm font-normal cursor-pointer">
              Lounge Access
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search and main controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards by name, issuer, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="annualFee">Lowest Fee</SelectItem>
            <SelectItem value="rewards">Best Rewards</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Narrow down your card search
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results count and active filters */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCards} cards
        </p>

        {activeFilterCount > 0 && (
          <>
            <span className="text-muted-foreground">|</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-auto py-1 px-2 text-sm"
            >
              Clear all
              <X className="h-3 w-3 ml-1" />
            </Button>
          </>
        )}
      </div>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => toggleCategory(category)}
            >
              {categories.find((c) => c.value === category)?.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {selectedNetworks.map((network) => (
            <Badge
              key={network}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => toggleNetwork(network)}
            >
              {networks.find((n) => n.value === network)?.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {noAnnualFee && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onNoAnnualFeeChange(false)}
            >
              No Annual Fee
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {maxAnnualFee && !noAnnualFee && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onMaxAnnualFeeChange(null)}
            >
              Up to ₹{maxAnnualFee.toLocaleString()}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {hasLoungeAccess && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onHasLoungeAccessChange(false)}
            >
              Lounge Access
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Desktop sidebar filters component
export function CardFiltersSidebar({
  selectedCategories,
  onCategoryChange,
  selectedNetworks,
  onNetworkChange,
  selectedTiers,
  onTierChange,
  maxAnnualFee,
  onMaxAnnualFeeChange,
  noAnnualFee,
  onNoAnnualFeeChange,
  hasLoungeAccess,
  onHasLoungeAccessChange,
}: Omit<CardFiltersProps, "searchQuery" | "onSearchChange" | "sortBy" | "onSortChange" | "totalCards" | "filteredCount">) {
  const toggleCategory = (category: CardCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const toggleNetwork = (network: CardNetwork) => {
    if (selectedNetworks.includes(network)) {
      onNetworkChange(selectedNetworks.filter((n) => n !== network))
    } else {
      onNetworkChange([...selectedNetworks, network])
    }
  }

  const toggleTier = (tier: CardTier) => {
    if (selectedTiers.includes(tier)) {
      onTierChange(selectedTiers.filter((t) => t !== tier))
    } else {
      onTierChange([...selectedTiers, tier])
    }
  }

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-6 bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg text-foreground">Filters</h3>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`sidebar-category-${category.value}`}
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={() => toggleCategory(category.value)}
                />
                <Label
                  htmlFor={`sidebar-category-${category.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Networks */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Card Network</h4>
          <div className="space-y-2">
            {networks.map((network) => (
              <div key={network.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`sidebar-network-${network.value}`}
                  checked={selectedNetworks.includes(network.value)}
                  onCheckedChange={() => toggleNetwork(network.value)}
                />
                <Label
                  htmlFor={`sidebar-network-${network.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {network.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tier */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Card Tier</h4>
          <div className="space-y-2">
            {tiers.map((tier) => (
              <div key={tier.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`sidebar-tier-${tier.value}`}
                  checked={selectedTiers.includes(tier.value)}
                  onCheckedChange={() => toggleTier(tier.value)}
                />
                <Label
                  htmlFor={`sidebar-tier-${tier.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {tier.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Annual Fee */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Annual Fee</h4>
          <Select
            value={noAnnualFee ? "0" : maxAnnualFee?.toString() || "any"}
            onValueChange={(value) => {
              if (value === "any") {
                onMaxAnnualFeeChange(null)
                onNoAnnualFeeChange(false)
              } else if (value === "0") {
                onNoAnnualFeeChange(true)
                onMaxAnnualFeeChange(null)
              } else {
                onNoAnnualFeeChange(false)
                onMaxAnnualFeeChange(parseInt(value))
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select fee range" />
            </SelectTrigger>
            <SelectContent>
              {feeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters */}
        <div>
          <h4 className="font-medium text-sm text-foreground mb-3">Features</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sidebar-lounge-access"
                checked={hasLoungeAccess}
                onCheckedChange={(checked) => onHasLoungeAccessChange(checked as boolean)}
              />
              <Label htmlFor="sidebar-lounge-access" className="text-sm font-normal cursor-pointer">
                Lounge Access
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
