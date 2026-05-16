"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { UserTransaction } from "@/lib/db/transactions-list"
import { reclassifyTransactionAction } from "./actions"

const CATEGORIES = [
  "dining",
  "fuel",
  "travel",
  "shopping_online",
  "shopping_offline",
  "grocery",
  "utilities",
  "rent",
  "wallet",
  "government",
  "education",
  "insurance",
  "swiggy",
  "zomato",
  "amazon",
  "flipkart",
  "myntra",
  "uber",
  "makemytrip",
  "smartbuy",
  "shopping",
  "other",
] as const

export function TransactionList({ transactions }: { transactions: UserTransaction[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleReclassify(txnId: string, category: string) {
    startTransition(async () => {
      await reclassifyTransactionAction(txnId, category as (typeof CATEGORIES)[number])
      router.refresh()
    })
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center gap-3 p-3 border rounded-md text-sm">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{t.merchant}</p>
            <p className="text-xs text-muted-foreground">
              {t.date} · {t.cardName} · ₹{t.amount.toLocaleString("en-IN")}
            </p>
          </div>
          <Select
            value={t.category ?? "other"}
            onValueChange={(v) => handleReclassify(t.id, v)}
            disabled={isPending}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {t.reward > 0 && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
              +₹{t.reward}
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}
