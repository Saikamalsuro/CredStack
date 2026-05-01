"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Plane, ShoppingBag, Percent, Fuel, CreditCard as CreditCardIcon, Award, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCardVisual } from "./credit-card-visual"
import { cn } from "@/lib/utils"
import type { CreditCard, CardCategory } from "@/lib/data/cards"

interface CardGridItemProps {
  card: CreditCard
  index?: number
  onCompare?: (card: CreditCard) => void
  isComparing?: boolean
}

const categoryIcons: Record<CardCategory, typeof Plane> = {
  travel: Plane,
  cashback: Percent,
  rewards: Award,
  business: Building2,
  student: CreditCardIcon,
  premium: Star,
  fuel: Fuel,
  shopping: ShoppingBag,
}

const categoryColors: Record<CardCategory, string> = {
  travel: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  cashback: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  rewards: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  business: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  student: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  premium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  fuel: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  shopping: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
}

export function CardGridItem({ card, index = 0, onCompare, isComparing = false }: CardGridItemProps) {
  const primaryCategory = card.category[0]
  const CategoryIcon = categoryIcons[primaryCategory]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Featured badge */}
        {card.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
              Featured
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          {/* Card visual */}
          <div className="flex justify-center mb-6">
            <CreditCardVisual card={card} size="md" showDetails={false} />
          </div>

          {/* Card info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {card.name}
              </h3>
              <p className="text-sm text-muted-foreground">{card.issuer}</p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5">
              {card.category.slice(0, 3).map((cat) => {
                const Icon = categoryIcons[cat]
                return (
                  <Badge 
                    key={cat} 
                    variant="secondary" 
                    className={cn("text-xs gap-1", categoryColors[cat])}
                  >
                    <Icon className="h-3 w-3" />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Badge>
                )
              })}
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Annual Fee</p>
                <p className="font-semibold text-foreground">
                  {card.annualFee === 0 ? "FREE" : `₹${card.annualFee.toLocaleString()}`}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Rewards</p>
                <p className="font-semibold text-foreground">
                  {card.rewards.rate}% {card.rewards.type}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-sm">{card.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({card.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button asChild className="flex-1">
                <Link href={`/cards/${card.id}`}>View Details</Link>
              </Button>
              {onCompare && (
                <Button 
                  variant={isComparing ? "secondary" : "outline"} 
                  onClick={() => onCompare(card)}
                  className="shrink-0"
                >
                  {isComparing ? "Added" : "Compare"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
