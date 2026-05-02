"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface CardLite {
  slug: string
  name: string
  issuer: string
  cardColor: string
  categories: string[]
}

const QUICK_LINKS = [
  { label: "Browse all cards", href: "/cards" },
  { label: "Compare cards", href: "/compare" },
  { label: "AI advisor", href: "/advisor" },
  { label: "Spend analyzer", href: "/analyzer" },
  { label: "Optimizer", href: "/optimizer" },
  { label: "Eligibility check", href: "/eligibility" },
  { label: "Offers", href: "/offers" },
  { label: "Methodology", href: "/methodology" },
]

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [cards, setCards] = React.useState<CardLite[]>([])
  const [loading, setLoading] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        const target = e.target as HTMLElement | null
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  React.useEffect(() => {
    if (!open || loaded || loading) return
    setLoading(true)
    fetch("/api/cards/list")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.cards)) setCards(data.cards)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
      .finally(() => setLoading(false))
  }, [open, loaded, loading])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search cards, pages..." />
        <CommandList>
          <CommandEmpty>{loading ? "Loading..." : "No matches."}</CommandEmpty>

          <CommandGroup heading="Quick links">
            {QUICK_LINKS.map((q) => (
              <CommandItem key={q.href} value={q.label} onSelect={() => go(q.href)}>
                {q.label}
              </CommandItem>
            ))}
          </CommandGroup>

          {cards.length > 0 && (
            <CommandGroup heading="Cards">
              {cards.map((c) => (
                <CommandItem
                  key={c.slug}
                  value={`${c.name} ${c.issuer} ${c.categories.join(" ")}`}
                  onSelect={() => go(`/cards/${c.slug}`)}
                >
                  <div className={`w-8 h-5 rounded bg-gradient-to-br ${c.cardColor} mr-2 shrink-0`} />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{c.issuer}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
