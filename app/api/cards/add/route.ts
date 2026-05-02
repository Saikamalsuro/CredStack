import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/helpers'
import { addUserCard } from '@/lib/db/user-cards'

const RequestSchema = z.object({
  cardSlug: z.string().min(1),
  lastFour: z.string().regex(/^\d{4}$/),
  statementDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
  creditLimit: z.number().int().nonnegative(),
  nickname: z.string().max(50).optional(),
})

export async function POST(request: Request) {
  const user = await requireAuth('/auth/sign-in')
  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const { id } = await addUserCard({
      userId: user.id,
      cardSlug: parsed.data.cardSlug,
      cardLastFour: parsed.data.lastFour,
      statementDay: parsed.data.statementDay,
      dueDay: parsed.data.dueDay,
      creditLimit: parsed.data.creditLimit,
      nickname: parsed.data.nickname,
    })
    return NextResponse.json({ userCardId: id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to add card'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
