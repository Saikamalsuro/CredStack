"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Moon, Sun, LayoutDashboard, LogOut, UserCircle, Home as HomeIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SearchCommand } from "@/components/layout/search-command"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Cards", href: "/cards", icon: CreditCard },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

export function Header({ displayName }: { displayName?: string | null }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  if (pathname.startsWith("/auth/")) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8" aria-label="Global">
        {/* Sidebar toggle (full feature menu) */}
        <AppSidebar />

        {/* Logo */}
        <motion.div
          className="flex"
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

        {/* Primary navigation (desktop only) */}
        <motion.div
          className="hidden md:flex md:gap-x-1 md:ml-6"
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

        <div className="flex-1" />

        {/* Right side actions */}
        <motion.div
          className="flex items-center gap-1 sm:gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchCommand />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          {displayName ? (
            <>
              <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-primary/5 border border-border">
                <UserCircle className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground max-w-[140px] truncate">{displayName}</span>
              </span>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </form>
            </>
          ) : (
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <Link href="/auth/sign-in">Get Started</Link>
            </Button>
          )}
        </motion.div>
      </nav>
    </header>
  )
}
