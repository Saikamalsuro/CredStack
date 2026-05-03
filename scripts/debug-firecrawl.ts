import 'dotenv/config'
import Firecrawl from '@mendable/firecrawl-js'

const url = process.argv[2] ?? 'https://www.cardexpert.in/'
const onlyMain = process.argv[3] !== 'false'

async function main() {
  const fc = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! })
  console.log(`scrape ${url} onlyMainContent=${onlyMain}`)
  const r = await fc.scrape(url, {
    formats: ['markdown'],
    onlyMainContent: onlyMain,
    waitFor: 3000,
  } as never)
  console.log('keys:', Object.keys(r ?? {}))
  console.log('markdown bytes:', r?.markdown?.length ?? 0)
  console.log('--- first 2000 chars ---')
  console.log((r?.markdown ?? '').slice(0, 2000))
  console.log('--- metadata ---')
  console.log(JSON.stringify(r?.metadata ?? {}, null, 2).slice(0, 1000))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
