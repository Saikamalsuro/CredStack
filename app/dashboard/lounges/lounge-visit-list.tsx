"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Plane } from "lucide-react"
import type { LoungeVisit } from "@/lib/db/lounge-visits"
import { deleteLoungeVisitAction } from "./actions"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function LoungeVisitList({ visits }: { visits: LoungeVisit[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (visits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">No visits logged yet.</p>
    )
  }

  return (
    <div className="space-y-2">
      {visits.map((v) => (
        <div key={v.id} className="flex items-center gap-3 p-3 border rounded-md text-sm">
          <Plane className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{v.loungeName}</p>
            <p className="text-xs text-muted-foreground">
              {v.cardName} • {formatDate(v.visitDate)}
              {v.guestCount > 0 ? ` • ${v.guestCount} guest${v.guestCount === 1 ? "" : "s"}` : ""}
            </p>
          </div>
          <Badge variant={v.visitType === "international" ? "default" : "outline"}>
            {v.visitType === "international" ? "Intl" : "Domestic"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deleteLoungeVisitAction(v.id)
                router.refresh()
              })
            }
            aria-label="Delete visit"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
    </div>
  )
}
