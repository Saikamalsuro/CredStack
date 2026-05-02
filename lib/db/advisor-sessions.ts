import { createAdminClient } from './admin'
import type { SpendingProfile } from '@/lib/types/extended'
import type { Json } from './types'

export async function saveAdvisorSession(input: {
  userId: string | null
  spendingProfile: SpendingProfile & { preferFreeCards: boolean; needsLoungeAccess: boolean }
  monthlySpend: number
  recommendedCardIds: string[]
  llmExplanations: Record<string, string>
}): Promise<{ id: string }> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('advisor_sessions')
    .insert({
      user_id: input.userId,
      spending_profile: input.spendingProfile as unknown as Json,
      monthly_spend: input.monthlySpend,
      preferences: {
        preferFreeCards: input.spendingProfile.preferFreeCards,
        needsLoungeAccess: input.spendingProfile.needsLoungeAccess,
      },
      recommended_card_ids: input.recommendedCardIds,
      llm_explanations: input.llmExplanations as unknown as Json,
    })
    .select('id')
    .single()

  if (error) throw error
  return { id: data.id }
}
