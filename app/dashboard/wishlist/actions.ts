"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/helpers"
import { addToWishlist, removeFromWishlist } from "@/lib/db/wishlist"

export async function addToWishlistAction(cardSlug: string, notes?: string) {
  const user = await requireAuth(`/auth/sign-in?redirect=/cards/${cardSlug}`)
  await addToWishlist(user.id, cardSlug, notes)
  revalidatePath("/dashboard/wishlist")
  revalidatePath(`/cards/${cardSlug}`)
}

export async function removeFromWishlistAction(cardSlug: string) {
  const user = await requireAuth(`/auth/sign-in?redirect=/cards/${cardSlug}`)
  await removeFromWishlist(user.id, cardSlug)
  revalidatePath("/dashboard/wishlist")
  revalidatePath(`/cards/${cardSlug}`)
}
