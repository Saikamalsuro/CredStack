"use server"

import { requireAuth } from "@/lib/auth/helpers"
import { exportUserData, deleteAllUserData } from "@/lib/db/data-vault"
import { createServerClient } from "@/lib/db/server"

export async function downloadDataAction(): Promise<{ json?: string; error?: string }> {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/privacy")
  try {
    const data = await exportUserData(user.id, user.email ?? null)
    return { json: JSON.stringify(data, null, 2) }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Export failed" }
  }
}

export async function deleteAccountAction(): Promise<{ error?: string }> {
  const user = await requireAuth("/auth/sign-in?redirect=/dashboard/privacy")
  try {
    await deleteAllUserData(user.id)
    const supabase = await createServerClient()
    await supabase.auth.signOut()
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Delete failed" }
  }
  return {}
}
