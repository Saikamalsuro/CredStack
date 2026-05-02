import { serve } from 'inngest/next'
import { inngest } from '@/lib/jobs/client'
import { parseStatement } from '@/lib/jobs/parse-statement'
import { cleanupOldStatements } from '@/lib/jobs/cleanup-statements'
import { scrapeOffers } from '@/lib/jobs/scrape-offers'
import { expireOldOffers } from '@/lib/jobs/expire-offers'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [parseStatement, cleanupOldStatements, scrapeOffers, expireOldOffers],
})
