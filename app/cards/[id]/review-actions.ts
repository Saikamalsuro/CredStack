"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/helpers"
import { postReview, toggleHelpfulVote } from "@/lib/db/reviews"

export async function postReviewAction(input: {
  cardSlug: string
  rating: number
  title?: string
  body: string
}): Promise<{ error?: string; id?: string }> {
  const user = await requireAuth(`/auth/sign-in?redirect=/cards/${input.cardSlug}`)
  try {
    const res = await postReview({ userId: user.id, ...input })
    revalidatePath(`/cards/${input.cardSlug}`)
    return { id: res.id }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed" }
  }
}

export async function toggleHelpfulVoteAction(reviewId: string): Promise<{ voted: boolean }> {
  const user = await requireAuth("/auth/sign-in")
  return await toggleHelpfulVote(user.id, reviewId)
}
