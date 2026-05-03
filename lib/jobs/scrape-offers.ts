import { inngest } from './client'
import { runAllEnabledSources, runSourceBySlug } from '@/lib/scraping/orchestrator'

// Mondays 6 AM IST — bank hubs (orchestrator filters by enabled flag)
export const scrapeOffers = inngest.createFunction(
  {
    id: 'scrape-offers',
    triggers: [
      { cron: '0 6 * * MON' },
      { cron: '0 5 * * TUE,FRI' },
      { event: 'offers.scrape.requested' },
    ],
  },
  async ({ event }) => {
    const sourceSlug = (event?.data as { sourceSlug?: string } | undefined)?.sourceSlug
    if (sourceSlug) {
      const r = await runSourceBySlug(sourceSlug, 'manual')
      return { results: [r] }
    }
    const results = await runAllEnabledSources('cron')
    return { results }
  }
)
