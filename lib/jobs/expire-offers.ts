import { inngest } from './client'
import { createAdminClient } from '@/lib/db/admin'

export const expireOldOffers = inngest.createFunction(
  {
    id: 'expire-old-offers',
    triggers: [{ cron: '0 3 * * *' }],
  },
  async () => {
    const supabase = createAdminClient()
    const today = new Date().toISOString().slice(0, 10)
    const { error, count } = await supabase
      .from('offers')
      .update({ is_active: false }, { count: 'exact' })
      .eq('is_active', true)
      .lt('valid_until', today)
    if (error) throw error
    return { expired: count ?? 0 }
  }
)
