import { createServerClient } from './server'

export interface UpcomingPayment {
  id: string
  cardName: string
  dueDate: string
  amount: number
  minDue: number
}

export async function getUpcomingPayments(userId: string): Promise<UpcomingPayment[]> {
  const supabase = await createServerClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('card_payments')
    .select(`
      id, due_date, total_due, min_due,
      user_cards!inner(cards!inner(name))
    `)
    .eq('user_id', userId)
    .is('paid_at', null)
    .gte('due_date', today)
    .order('due_date', { ascending: true })
    .limit(5)
  if (error) throw error

  return (data ?? []).map((row) => {
    const card = (row.user_cards as unknown as { cards: { name: string } }).cards
    return {
      id: row.id,
      cardName: card?.name ?? 'Card',
      dueDate: new Date(row.due_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      }),
      amount: row.total_due,
      minDue: row.min_due,
    }
  })
}
