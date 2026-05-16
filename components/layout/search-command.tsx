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
import { SITE_PAGES, type SitePage } from "@/lib/data/site-pages.generated"

interface CardLite {
  slug: string
  name: string
  issuer: string
  cardColor: string
  categories: string[]
}

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

  const pagesByGroup = React.useMemo(() => {
    const map = new Map<string, SitePage[]>()
    for (const p of SITE_PAGES) {
      const arr = map.get(p.group) ?? []
      arr.push(p)
      map.set(p.group, arr)
    }
    const order = ["Home", "Cards", "AI tools", "Rewards", "Tools", "Apply", "Safety", "Learn", "About", "Support", "Company", "Legal", "Pages"]
    return [...map.entries()].sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0])
    )
  }, [])

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search cards, pages, anything..." />
        <CommandList>
          <CommandEmpty>{loading ? "Loading..." : "No matches."}</CommandEmpty>

          {pagesByGroup.map(([group, pages]) => (
            <CommandGroup key={group} heading={group}>
              {pages.map((p) => (
                <CommandItem
                  key={p.href}
                  value={`${p.title} ${p.keywords}`}
                  onSelect={() => go(p.href)}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{p.title}</span>
                    {p.description ? (
                      <span className="text-xs text-muted-foreground truncate">
                        {p.description}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground truncate">{p.href}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

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
