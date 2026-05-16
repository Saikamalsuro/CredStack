"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/helpers"
import { softDeleteUserCard } from "@/lib/db/user-cards"

export async function removeUserCardAction(userCardId: string) {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/cards")
  await softDeleteUserCard(user.id, userCardId)
  revalidatePath("/dashboard/cards")
  revalidatePath("/dashboard")
}
