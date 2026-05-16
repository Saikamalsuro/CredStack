"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/helpers"
import { logLoungeVisit, deleteLoungeVisit } from "@/lib/db/lounge-visits"

export async function logLoungeVisitAction(input: {
  userCardId: string
  visitDate: string
  loungeName: string
  visitType: "domestic" | "international"
  guestCount: number
}): Promise<{ error?: string }> {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/lounges")
  try {
    await logLoungeVisit({
      userId: user.id,
      userCardId: input.userCardId,
      visitDate: input.visitDate,
      loungeName: input.loungeName,
      visitType: input.visitType,
      guestCount: input.guestCount,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to log visit" }
  }
  revalidatePath("/dashboard/lounges")
  revalidatePath("/dashboard")
  return {}
}

export async function deleteLoungeVisitAction(visitId: string) {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/lounges")
  await deleteLoungeVisit(user.id, visitId)
  revalidatePath("/dashboard/lounges")
  revalidatePath("/dashboard")
}
