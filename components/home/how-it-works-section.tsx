"use client"

import { motion } from "framer-motion"
import { Search, GitCompare, Sparkles, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description: "Explore our comprehensive database of credit cards. Filter by rewards, fees, categories, and more to find cards that match your needs.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: GitCompare,
    title: "Compare Side-by-Side",
    description: "Select up to 4 cards to compare in detail. See features, fees, rewards, and benefits laid out clearly for easy decision making.",
    color: "from-teal-500 to-teal-600"
  },
  {
    icon: Sparkles,
    title: "Get AI Recommendations",
    description: "Our AI analyzes your spending patterns and preferences to suggest the perfect cards that maximize your rewards and savings.",
    color: "from-primary to-accent"
  },
  {
    icon: TrendingUp,
    title: "Track & Optimize",
    description: "Use our dashboard to monitor your card performance, track rewards, and get insights to optimize your credit card strategy.",
    color: "from-green-500 to-emerald-600"
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            How CredStack Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to finding and maximizing the right credit card for your lifestyle.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
