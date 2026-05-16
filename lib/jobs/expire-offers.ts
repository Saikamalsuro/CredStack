import { inngest } from './client'
import { createAdminClient } from '@/lib/db/admin'

export const expireOldOffers = inngest.createFunction(
  {
    id: 'expire-old-offers',
    triggers: [
      { event: 'offers.expire.requested' },
      { cron: '0 3 * * *' },
    ],
  },
  async () => {
    const supabase = createAdminClient()
    const now = new Date().toISOString()
    const { error, count } = await supabase
      .from('offers')
      .update({ is_active: false }, { count: 'exact' })
      .eq('is_active', true)
      .lt('ends_at', now)
    if (error) throw error
    return { expired: count ?? 0 }
  }
)
