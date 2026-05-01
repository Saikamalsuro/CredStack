"use client"

import { motion } from "framer-motion"
import { CreditCard, Users, TrendingUp, Award } from "lucide-react"

const stats = [
  {
    icon: CreditCard,
    value: "50+",
    label: "Credit Cards",
    description: "Comprehensive card database"
  },
  {
    icon: Users,
    value: "100K+",
    label: "Active Users",
    description: "Trust CredStack"
  },
  {
    icon: TrendingUp,
    value: "₹2.5Cr+",
    label: "Rewards Saved",
    description: "For our users"
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "User Rating",
    description: "Based on reviews"
  }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
      {/* Background pattern */}
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
                className="text-4xl font-bold text-white"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-lg font-medium text-white/90 mt-1">
                {stat.label}
              </p>
              <p className="text-sm text-white/70 mt-1">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
