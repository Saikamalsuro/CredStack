"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCardVisual } from "@/components/cards/credit-card-visual"
import type { CreditCard } from "@/lib/data/cards"

interface HeroSectionProps {
  floatingCards: CreditCard[]
}

export function HeroSection({ floatingCards }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Credit Intelligence
              </Badge>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              <span className="block">Find Your</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Perfect Card
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Compare credit cards, analyze rewards, and get personalized AI recommendations 
              to maximize your benefits and save money.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="p-1.5 bg-success/10 rounded-full">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <span>Smart Comparisons</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>Secure Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="p-1.5 bg-accent/10 rounded-full">
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <span>Instant Insights</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-base px-8">
                <Link href="/cards">
                  Explore Cards
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/compare">
                  Compare Cards
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground">Cards Analyzed</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">100K+</p>
                <p className="text-sm text-muted-foreground">Users Trust Us</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Floating cards */}
          <motion.div
            className="relative h-[400px] lg:h-[500px] hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main card */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <CreditCardVisual card={floatingCards[0]} size="lg" />
            </motion.div>

            {/* Secondary card - left */}
            <motion.div
              className="absolute top-1/4 left-0 z-10"
              animate={{ 
                y: [0, 15, 0],
                rotateZ: [-5, -3, -5]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <CreditCardVisual card={floatingCards[1]} size="md" className="opacity-80" />
            </motion.div>

            {/* Tertiary card - right */}
            <motion.div
              className="absolute bottom-1/4 right-0 z-10"
              animate={{ 
                y: [0, -15, 0],
                rotateZ: [5, 3, 5]
              }}
              transition={{ 
                duration: 4.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            >
              <CreditCardVisual card={floatingCards[2]} size="md" className="opacity-80" />
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-10 right-20 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-accent/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  )
}
