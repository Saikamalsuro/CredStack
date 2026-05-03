/**
 * Populate cards.embedding for every active card via Xenova MiniLM.
 *
 * Run: pnpm tsx scripts/embed-cards.ts
 *
 * Reads .env.local for SUPABASE_SERVICE_ROLE_KEY (RLS bypass on UPDATE).
 * Idempotent — re-running overwrites with fresh embeddings.
 */

import 'dotenv/config'
import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'
import { getAllExtendedCards } from '../lib/db/cards-extended'
import { createAdminClient } from '../lib/db/admin'
import { embedText, EMBEDDING_DIMENSIONS } from '../lib/ai/embeddings'
import { buildCardFeatureString } from '../lib/ai/card-feature-string'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  console.log('Fetching cards...')
  const cards = await getAllExtendedCards()
  console.log(`  ${cards.length} cards`)

  console.log('Loading MiniLM model (first run downloads ~25 MB)...')

  const supabase = createAdminClient()
  let done = 0

  for (const card of cards) {
    const text = buildCardFeatureString(card)
    const embedding = await embedText(text)
    if (embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(`Expected ${EMBEDDING_DIMENSIONS} dims, got ${embedding.length}`)
    }

    const { error } = await supabase
      .from('cards')
      .update({ embedding: JSON.stringify(embedding) } as never)
      .eq('slug', card.id)
    if (error) {
      console.error(`  ${card.id} -> error: ${error.message}`)
    } else {
      done += 1
      console.log(`  ${card.id} -> embedded (${done}/${cards.length})`)
    }
  }

  console.log(`Done. ${done} embeddings written.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
