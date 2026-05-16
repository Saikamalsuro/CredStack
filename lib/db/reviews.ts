import { createPublicClient } from './public-client'
import { createServerClient } from './server'

export interface CardReview {
  id: string
  userId: string
  userName: string | null
  rating: number
  title: string | null
  body: string
  isVerifiedCardholder: boolean
  helpfulCount: number
  createdAt: string
}

export interface ReviewSummary {
  count: number
  average: number
  distribution: { stars: number; count: number }[]
}

export interface ExpertReview {
  id: string
  reviewerName: string
  reviewerTitle: string | null
  body: string
  rating: number | null
  pros: string[]
  cons: string[]
  useCase: string | null
  publishedAt: string
}

const REVIEW_DISPLAY_GATE = 10

export async function getCardReviewSummary(cardId: string): Promise<ReviewSummary> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('card_id', cardId)
  if (error) throw error
  const all = data ?? []
  const count = all.length
  const avg = count > 0 ? all.reduce((s, r) => s + Number(r.rating), 0) / count : 0
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: all.filter((r) => Math.round(Number(r.rating)) === stars).length,
  }))
  return { count, average: avg, distribution }
}

export async function getCardReviews(cardId: string, limit = 20): Promise<CardReview[]> {
  const supabase = createPublicClient()
  const summary = await getCardReviewSummary(cardId)
  if (summary.count < REVIEW_DISPLAY_GATE) return []
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, user_id, rating, title, body, is_verified_cardholder, helpful_count, created_at,
      profiles(full_name)
    `)
    .eq('card_id', cardId)
    .order('helpful_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map((row) => {
    const profile = row.profiles as unknown as { full_name: string | null } | null
    return {
      id: row.id,
      userId: row.user_id,
      userName: profile?.full_name ?? null,
      rating: Number(row.rating),
      title: row.title,
      body: row.body,
      isVerifiedCardholder: row.is_verified_cardholder ?? false,
      helpfulCount: row.helpful_count ?? 0,
      createdAt: row.created_at,
    }
  })
}

export const REVIEW_GATE = REVIEW_DISPLAY_GATE

export async function getExpertReviews(cardId: string): Promise<ExpertReview[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('expert_reviews')
    .select('*')
    .eq('card_id', cardId)
    .order('published_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    reviewerName: row.reviewer_name,
    reviewerTitle: row.reviewer_title,
    body: row.body,
    rating: row.rating ? Number(row.rating) : null,
    pros: row.pros ?? [],
    cons: row.cons ?? [],
    useCase: row.use_case,
    publishedAt: row.published_at,
  }))
}

export async function postReview(input: {
  userId: string
  cardSlug: string
  rating: number
  title?: string
  body: string
}): Promise<{ id: string }> {
  const supabase = await createServerClient()
  const { data: card, error: lookupErr } = await supabase
    .from('cards')
    .select('id')
    .eq('slug', input.cardSlug)
    .maybeSingle()
  if (lookupErr) throw lookupErr
  if (!card) throw new Error('card not found')

  // Check if user holds the card → verified flag
  const { data: userCard } = await supabase
    .from('user_cards')
    .select('id')
    .eq('user_id', input.userId)
    .eq('card_id', card.id)
    .is('removed_at', null)
    .maybeSingle()

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: input.userId,
      card_id: card.id,
      rating: input.rating,
      title: input.title ?? null,
      body: input.body,
      is_verified_cardholder: Boolean(userCard),
    })
    .select('id')
    .single()
  if (error) throw error
  return { id: data.id }
}

export async function toggleHelpfulVote(userId: string, reviewId: string): Promise<{ voted: boolean }> {
  const supabase = await createServerClient()
  const { data: existing } = await supabase
    .from('card_review_votes')
    .select('id')
    .eq('user_id', userId)
    .eq('review_id', reviewId)
    .maybeSingle()
  if (existing) {
    await supabase.from('card_review_votes').delete().eq('id', existing.id)
    // best-effort decrement
    await supabase.rpc('decrement_helpful_count', { p_review_id: reviewId }).then(() => {}, () => {})
    return { voted: false }
  }
  await supabase.from('card_review_votes').insert({ user_id: userId, review_id: reviewId })
  await supabase.rpc('increment_helpful_count', { p_review_id: reviewId }).then(() => {}, () => {})
  return { voted: true }
}
