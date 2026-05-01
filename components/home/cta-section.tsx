"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-border p-8 sm:p-12 lg:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Background decorations */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Recommendations
            </motion.div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Ready to Maximize Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Card Rewards?
              </span>
            </h2>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Join thousands of smart cardholders who use CredStack to find the best cards, 
              compare benefits, and optimize their rewards strategy.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-base px-8">
                <Link href="/advisor">
                  Get AI Recommendations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/cards">
                  Browse All Cards
                </Link>
              </Button>
            </div>

            {/* Trust badge */}
            <p className="mt-8 text-sm text-muted-foreground">
              Trusted by 100,000+ users across India
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
