"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink, Trash2, IndianRupee, CalendarClock } from "lucide-react"
import type { CreditCard } from "@/lib/data/cards"
import { removeUserCardAction } from "./actions"

interface MyCardRowProps {
  userCardId: string
  card: CreditCard
  lastFour: string | null
  nickname: string | null
  statementDay: number | null
  dueDay: number | null
  creditLimit: number | null
  isPrimary: boolean
}

export function MyCardRow({
  userCardId,
  card,
  lastFour,
  nickname,
  statementDay,
  dueDay,
  creditLimit,
  isPrimary,
}: MyCardRowProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function handleRemove() {
    startTransition(async () => {
      await removeUserCardAction(userCardId)
      router.refresh()
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-20 h-12 rounded-md bg-gradient-to-br ${card.cardColor} shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Link
                href={`/cards/${card.id}`}
                className="font-semibold hover:underline truncate"
              >
                {nickname ?? card.name}
              </Link>
              {isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
              {lastFour && <Badge variant="outline" className="text-xs font-mono">•••• {lastFour}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mb-2 truncate">{card.issuer}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {statementDay && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarClock className="h-3 w-3" />
                  Statement: {statementDay}
                </div>
              )}
              {dueDay && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarClock className="h-3 w-3" />
                  Due: {dueDay}
                </div>
              )}
              {creditLimit && creditLimit > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <IndianRupee className="h-3 w-3" />
                  Limit: ₹{(creditLimit / 1000).toFixed(0)}k
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/cards/${card.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View card details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setConfirming(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove from portfolio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {confirming && (
          <div className="mt-4 p-3 bg-destructive/5 border border-destructive/30 rounded-md flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm flex-1">Remove this card from your portfolio?</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="destructive" onClick={handleRemove} disabled={isPending}>
                {isPending ? "Removing..." : "Remove"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
