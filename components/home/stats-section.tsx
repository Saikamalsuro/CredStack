"use client"

import { motion } from "framer-motion"
import { CreditCard, Database, CalendarClock, BadgeCheck } from "lucide-react"

interface StatsSectionProps {
  cardCount?: number
  lastVerifiedAt?: string | null
}

function formatVerifiedDate(iso?: string | null): string {
  if (!iso) return "Updated regularly"
  const d = new Date(iso)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function StatsSection({ cardCount = 83, lastVerifiedAt }: StatsSectionProps) {
  const stats = [
    {
      icon: CreditCard,
      value: `${cardCount}`,
      label: "Cards tracked",
      description: "Across 16 Indian issuers",
    },
    {
      icon: Database,
      value: "35+",
      label: "Data fields per card",
      description: "Rewards, fees, benefits, exclusions",
    },
    {
      icon: CalendarClock,
      value: formatVerifiedDate(lastVerifiedAt),
      label: "Last verified",
      description: "Continually re-checked against issuer sites",
    },
    {
      icon: BadgeCheck,
      value: "Ad-free",
      label: "No affiliate bias",
      description: "Direct bank links only",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="statsGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#statsGrid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <motion.p
                className="text-3xl sm:text-4xl font-bold text-white"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-lg font-medium text-white/90 mt-1">{stat.label}</p>
              <p className="text-sm text-white/70 mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
