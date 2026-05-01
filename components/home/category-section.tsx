"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plane, Percent, Award, Building2, GraduationCap, Crown, Fuel, ShoppingBag } from "lucide-react"

const categories = [
  { 
    name: "Travel", 
    icon: Plane, 
    description: "Airport lounge access & miles",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    href: "/cards?category=travel"
  },
  { 
    name: "Cashback", 
    icon: Percent, 
    description: "Get money back on spends",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    href: "/cards?category=cashback"
  },
  { 
    name: "Rewards", 
    icon: Award, 
    description: "Earn points on purchases",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    href: "/cards?category=rewards"
  },
  { 
    name: "Premium", 
    icon: Crown, 
    description: "Exclusive luxury benefits",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    href: "/cards?category=premium"
  },
  { 
    name: "Business", 
    icon: Building2, 
    description: "Built for entrepreneurs",
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    href: "/cards?category=business"
  },
  { 
    name: "Student", 
    icon: GraduationCap, 
    description: "First card starter options",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    href: "/cards?category=student"
  },
  { 
    name: "Fuel", 
    icon: Fuel, 
    description: "Save on petrol & diesel",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    href: "/cards?category=fuel"
  },
  { 
    name: "Shopping", 
    icon: ShoppingBag, 
    description: "E-commerce rewards",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    href: "/cards?category=shopping"
  }
]

export function CategorySection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Explore by Category
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect card based on your lifestyle and spending habits.
          </p>
        </motion.div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={category.href}
                className={`group block p-6 rounded-2xl border border-border ${category.bgColor} hover:shadow-lg hover:border-primary/20 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
