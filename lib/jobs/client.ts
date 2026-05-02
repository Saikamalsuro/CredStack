import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'credstack',
  eventKey: process.env.INNGEST_EVENT_KEY,
})

export type Events = {
  'analyzer.statement.uploaded': {
    data: { runId: string; userId: string; filePath: string; userCardId: string | null }
  }
  'offers.scrape.requested': {
    data: { merchant: string; url: string; extractor: string }
  }
}
