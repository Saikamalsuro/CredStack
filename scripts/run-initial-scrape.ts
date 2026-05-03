import 'dotenv/config'
import { runSourceBySlug } from '@/lib/scraping/orchestrator'

const sourceSlug = process.argv[2] ?? 'desidime-cc'

async function main() {
  console.log(`[scrape] running ${sourceSlug}…`)
  const result = await runSourceBySlug(sourceSlug, 'manual')
  console.log(JSON.stringify(result, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
