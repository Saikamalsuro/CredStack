import { z } from 'zod'

export const OfferExtractSchema = z.object({
  offers: z.array(z.object({
    title: z.string(),
    description: z.string().nullable(),
    applicableIssuers: z.array(z.string()).default([]),
    applicableNetworks: z.array(z.enum(['visa', 'mastercard', 'amex', 'rupay'])).default([]),
    discountType: z.enum(['flat', 'percent', 'cashback', 'instant']),
    discountValue: z.number().nullable(),
    minTxnAmount: z.number().nullable(),
    maxDiscount: z.number().nullable(),
    validFrom: z.string().nullable(),
    validUntil: z.string().nullable(),
  })),
})

export type OfferExtract = z.infer<typeof OfferExtractSchema>

export function buildOfferExtractPrompt(merchant: string, markdown: string) {
  const system = `Extract bank/card offers from this merchant page markdown. Output JSON {offers: [...]}. Each offer: title, description (nullable), applicableIssuers (array, e.g. ["HDFC","ICICI"]), applicableNetworks (array of visa|mastercard|amex|rupay), discountType (flat|percent|cashback|instant), discountValue, minTxnAmount (nullable), maxDiscount (nullable), validFrom (ISO or null), validUntil (ISO or null). Skip offers that don't reference banks or card networks. Return {offers: []} if none found.`
  const user = `Merchant: ${merchant}\n\n${markdown.slice(0, 30000)}`
  return { system, user }
}

export const fallbackOfferExtract: OfferExtract = { offers: [] }
