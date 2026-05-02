import { z } from 'zod'

const RewardCategoryEnum = z.enum([
  'dining', 'fuel', 'travel', 'shopping_online', 'shopping_offline',
  'grocery', 'utilities', 'rent', 'wallet', 'government',
  'education', 'insurance', 'smartbuy', 'flipkart', 'amazon',
  'myntra', 'swiggy', 'zomato', 'uber', 'makemytrip',
  'shopping', 'other',
])

export const ClassifyBatchSchema = z.object({
  classifications: z.array(z.object({
    merchant: z.string(),
    category: RewardCategoryEnum,
    normalized: z.string().optional(),
  })),
})

export type ClassifyBatch = z.infer<typeof ClassifyBatchSchema>

export function buildClassifyPrompt(merchants: string[]) {
  const system = `You classify Indian merchant strings into reward categories. Return JSON {classifications: [{merchant, category, normalized}]}. category is one of: dining, fuel, travel, shopping_online, shopping_offline, grocery, utilities, rent, wallet, government, education, insurance, smartbuy, flipkart, amazon, myntra, swiggy, zomato, uber, makemytrip, shopping, other. normalized is the cleaned-up merchant name (uppercase brand only). Use specific brand categories (amazon, flipkart, swiggy etc.) when the merchant matches that brand exactly; otherwise use the broad category.`
  const user = JSON.stringify({ merchants })
  return { system, user }
}

export const fallbackClassifyBatch: ClassifyBatch = { classifications: [] }
