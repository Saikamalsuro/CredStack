import { createServerClient } from './server'
import type { Database } from './types'

export type ApplicationStatus = Database['public']['Enums']['application_status']

export interface ApplicationEntry {
  id: string
  cardId: string
  cardSlug: string
  cardName: string
  cardIssuer: string
  cardColor: string
  appliedDate: string
  status: ApplicationStatus
  referenceNumber: string | null
  notes: string | null
  updatedAt: string
}

export async function listApplications(userId: string): Promise<ApplicationEntry[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_applications')
    .select(`
      id, card_id, applied_date, status, reference_number, notes, updated_at,
      cards!inner(slug, name, issuer, card_color_gradient)
    `)
    .eq('user_id', userId)
    .order('applied_date', { ascending: false })
  if (error) throw error
  return (data ?? []).map((row) => {
    const card = row.cards as unknown as {
      slug: string
      name: string
      issuer: string
      card_color_gradient: string
    }
    return {
      id: row.id,
      cardId: row.card_id,
      cardSlug: card.slug,
      cardName: card.name,
      cardIssuer: card.issuer,
      cardColor: card.card_color_gradient,
      appliedDate: row.applied_date,
      status: row.status,
      referenceNumber: row.reference_number,
      notes: row.notes,
      updatedAt: row.updated_at,
    }
  })
}

export async function createApplication(input: {
  userId: string
  cardSlug: string
  appliedDate: string
  status?: ApplicationStatus
  referenceNumber?: string
  notes?: string
}): Promise<{ id: string }> {
  const supabase = await createServerClient()
  const { data: card, error: lookupErr } = await supabase
    .from('cards')
    .select('id')
    .eq('slug', input.cardSlug)
    .maybeSingle()
  if (lookupErr) throw lookupErr
  if (!card) throw new Error(`card not found: ${input.cardSlug}`)
  const { data, error } = await supabase
    .from('user_applications')
    .insert({
      user_id: input.userId,
      card_id: card.id,
      applied_date: input.appliedDate,
      status: input.status ?? 'applied',
      reference_number: input.referenceNumber ?? null,
      notes: input.notes ?? null,
    })
    .select('id')
    .single()
  if (error) throw error
  return { id: data.id }
}

export async function updateApplicationStatus(
  userId: string,
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_applications')
    .update({ status })
    .eq('id', applicationId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function deleteApplication(userId: string, applicationId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_applications')
    .delete()
    .eq('id', applicationId)
    .eq('user_id', userId)
  if (error) throw error
}
