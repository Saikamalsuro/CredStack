import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/db/public-client'

export const revalidate = 600

export async function GET() {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select('slug, name, issuer, card_color_gradient, categories')
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    cards: (data ?? []).map((c) => ({
      slug: c.slug,
      name: c.name,
      issuer: c.issuer,
      cardColor: c.card_color_gradient,
      categories: c.categories,
    })),
  })
}
