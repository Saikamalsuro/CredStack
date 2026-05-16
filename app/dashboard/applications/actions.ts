"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/helpers"
import {
  createApplication,
  deleteApplication,
  updateApplicationStatus,
  type ApplicationStatus,
} from "@/lib/db/applications"

export async function createApplicationAction(input: {
  cardSlug: string
  appliedDate: string
  referenceNumber?: string
  notes?: string
}): Promise<{ error?: string }> {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/applications")
  try {
    await createApplication({ userId: user.id, ...input })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed" }
  }
  revalidatePath("/dashboard/applications")
  return {}
}

export async function updateApplicationStatusAction(id: string, status: ApplicationStatus) {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/applications")
  await updateApplicationStatus(user.id, id, status)
  revalidatePath("/dashboard/applications")
}

export async function deleteApplicationAction(id: string) {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/applications")
  await deleteApplication(user.id, id)
  revalidatePath("/dashboard/applications")
}
