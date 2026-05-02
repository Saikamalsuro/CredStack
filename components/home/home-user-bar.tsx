"use client"

import Link from "next/link"
import { LayoutDashboard, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeUserBarProps {
  fullName: string | null
  email: string | null
}

export function HomeUserBar({ fullName, email }: HomeUserBarProps) {
  const display = fullName?.trim() || email?.split("@")[0] || "there"

  return (
    <div className="bg-primary/5 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-full shrink-0">
            <UserCircle className="h-4 w-4 text-primary-foreground" />
          </div>
          <p className="text-sm text-foreground truncate">
            Welcome back, <span className="font-semibold">{display}</span>
            {email && (
              <span className="hidden sm:inline text-muted-foreground"> · {email}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
