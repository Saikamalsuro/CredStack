"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Menu, X, Search, Moon, Sun, BarChart3, Sparkles, LayoutDashboard, GitCompare } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: CreditCard },
  { name: "Cards", href: "/cards", icon: CreditCard },
  { name: "Compare", href: "/compare", icon: GitCompare },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Advisor", href: "/advisor", icon: Sparkles },
  { name: "Analyzer", href: "/analyzer", icon: BarChart3 },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <motion.div 
          className="flex lg:flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CredStack
            </span>
          </Link>
        </motion.div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <motion.div 
          className="hidden lg:flex lg:gap-x-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            )
          })}
        </motion.div>

        {/* Right side actions */}
        <motion.div 
          className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
            Get Started
          </Button>
        </motion.div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="lg:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="space-y-1 px-4 pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            <div className="flex items-center gap-2 pt-4 border-t border-border mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
