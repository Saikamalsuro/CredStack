"use client"

import { motion } from "framer-motion"
import { CreditCard as CreditCardIcon, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CreditCard } from "@/lib/data/cards"

interface CreditCardVisualProps {
  card: CreditCard
  size?: "sm" | "md" | "lg"
  className?: string
  showDetails?: boolean
}

const networkLogos: Record<string, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
  rupay: "RuPay",
  discover: "Discover",
}

export function CreditCardVisual({ 
  card, 
  size = "md", 
  className,
  showDetails = true 
}: CreditCardVisualProps) {
  const sizeClasses = {
    sm: "w-48 h-28",
    md: "w-72 h-44",
    lg: "w-96 h-60"
  }

  const textSizes = {
    sm: { name: "text-xs", issuer: "text-[10px]", network: "text-sm" },
    md: { name: "text-sm", issuer: "text-xs", network: "text-base" },
    lg: { name: "text-lg", issuer: "text-sm", network: "text-xl" }
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-xl",
        `bg-gradient-to-br ${card.cardColor}`,
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.02, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 250">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="400" height="250" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />

      {/* Card content */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <p className={cn("font-semibold truncate max-w-[70%]", textSizes[size].name)}>
              {card.name}
            </p>
            <p className={cn("opacity-80", textSizes[size].issuer)}>
              {card.issuer}
            </p>
          </div>
          <Wifi className={cn(
            "rotate-90 opacity-80",
            size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"
          )} />
        </div>

        {/* Chip */}
        {showDetails && (
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500",
              size === "sm" ? "w-8 h-6" : size === "md" ? "w-10 h-8" : "w-12 h-10"
            )}>
              <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1">
                <div className="bg-yellow-600/30 rounded-sm" />
                <div className="bg-yellow-600/30 rounded-sm" />
                <div className="bg-yellow-600/30 rounded-sm" />
                <div className="bg-yellow-600/30 rounded-sm" />
              </div>
            </div>
            <CreditCardIcon className={cn(
              "opacity-60",
              size === "sm" ? "h-4 w-4" : "h-5 w-5"
            )} />
          </div>
        )}

        {/* Card number placeholder */}
        {showDetails && (
          <div className={cn(
            "flex gap-2 font-mono tracking-wider opacity-90",
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
          )}>
            <span>****</span>
            <span>****</span>
            <span>****</span>
            <span>****</span>
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          {showDetails && (
            <div>
              <p className={cn("opacity-60 uppercase", textSizes[size].issuer)}>
                Card Holder
              </p>
              <p className={cn("font-medium", textSizes[size].issuer)}>
                YOUR NAME
              </p>
            </div>
          )}
          <p className={cn("font-bold tracking-wider", textSizes[size].network)}>
            {networkLogos[card.network]}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
