import { serve } from 'inngest/next'
import { inngest } from '@/lib/jobs/client'
import { parseStatement } from '@/lib/jobs/parse-statement'
import { cleanupOldStatements } from '@/lib/jobs/cleanup-statements'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [parseStatement, cleanupOldStatements],
})
