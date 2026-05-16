"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink } from "lucide-react"
import type { WishlistEntry } from "@/lib/db/wishlist"
import { removeFromWishlistAction } from "./actions"

export function WishlistRow({ item }: { item: WishlistEntry }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-16 h-10 rounded bg-gradient-to-br ${item.cardColor} shrink-0`} />
        <div className="flex-1 min-w-0">
          <Link href={`/cards/${item.cardSlug}`} className="font-semibold hover:underline truncate block">
            {item.cardName}
          </Link>
          <p className="text-xs text-muted-foreground">
            {item.cardIssuer} · ₹{item.annualFee.toLocaleString("en-IN")}/yr
          </p>
          {item.notes && <p className="text-xs text-muted-foreground italic mt-1">&quot;{item.notes}&quot;</p>}
        </div>
        <Button asChild variant="ghost" size="icon" aria-label="View card">
          <Link href={`/cards/${item.cardSlug}`}>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          aria-label="Remove"
          onClick={() =>
            startTransition(async () => {
              await removeFromWishlistAction(item.cardSlug)
              router.refresh()
            })
          }
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardContent>
    </Card>
  )
}
