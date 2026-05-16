"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/helpers"
import { createReferral, deleteReferral, markReferralCredited } from "@/lib/db/referrals"

export async function createReferralAction(input: {
  cardSlug: string | null
  referredName: string
  expectedBonus: number
  referredDate: string
  notes?: string
}): Promise<{ error?: string }> {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/referrals")
  try {
    await createReferral({ userId: user.id, ...input })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed" }
  }
  revalidatePath("/dashboard/referrals")
  return {}
}

export async function markReferralCreditedAction(id: string) {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/referrals")
  await markReferralCredited(user.id, id)
  revalidatePath("/dashboard/referrals")
}

export async function deleteReferralAction(id: string) {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/referrals")
  await deleteReferral(user.id, id)
  revalidatePath("/dashboard/referrals")
}
