import { pipeline, type FeatureExtractionPipeline } from '@xenova/transformers'

/**
 * Local sentence-embedding pipeline using @xenova/transformers (ONNX runtime).
 * Model: Xenova/all-MiniLM-L6-v2 (384-dim, ~25 MB on first run, cached after).
 * Output is mean-pooled and L2-normalized so cosine similarity == dot product.
 *
 * Server-only — Node runtime. Don't import in client components.
 */

let cached: FeatureExtractionPipeline | null = null
let pending: Promise<FeatureExtractionPipeline> | null = null

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (cached) return cached
  if (pending) return pending
  pending = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
  }) as Promise<FeatureExtractionPipeline>
  cached = await pending
  pending = null
  return cached
}

export async function embedText(text: string): Promise<number[]> {
  const extractor = await getExtractor()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data as Float32Array)
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  // Sequential to keep memory steady on small machines.
  const out: number[][] = []
  for (const text of texts) {
    out.push(await embedText(text))
  }
  return out
}

export const EMBEDDING_DIMENSIONS = 384
