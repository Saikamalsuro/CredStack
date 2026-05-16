"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/helpers"
import { reclassifyTransaction } from "@/lib/db/transactions-list"
import type { Database } from "@/lib/db/types"

type RewardCategory = Database["public"]["Enums"]["reward_category"]

export async function reclassifyTransactionAction(txnId: string, category: RewardCategory) {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/transactions")
  await reclassifyTransaction(user.id, txnId, category)
  revalidatePath("/dashboard/transactions")
  revalidatePath("/dashboard")
}
