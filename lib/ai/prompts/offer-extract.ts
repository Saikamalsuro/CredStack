import { z } from 'zod'

const OFFER_TYPES = [
  'cashback',
  'instant_discount',
  'reward_multiplier',
  'voucher',
  'bogo',
  'no_cost_emi',
  'milestone',
  'welcome',
  'lounge_access',
  'other',
] as const

const OFFER_CATEGORIES = [
  'food_delivery',
  'dining',
  'grocery',
  'ecommerce_general',
  'fashion',
  'electronics',
  'travel_flight',
  'travel_hotel',
  'travel_cab',
  'fuel',
  'utility',
  'entertainment',
  'health_wellness',
  'education',
  'insurance',
  'lifestyle',
  'other',
] as const

export const OfferExtractSchema = z.object({
  offers: z
    .array(
      z.object({
        externalId: z.string().nullable().optional(),
        title: z.string().min(3).max(280),
        description: z.string().nullable().optional(),
        offerType: z.enum(OFFER_TYPES),
        category: z.enum(OFFER_CATEGORIES),
        merchant: z.string().nullable().optional(),
        cardMention: z.string().nullable().optional(),
        eligibleIssuers: z.array(z.string()).default([]),
        eligibleNetworks: z
          .array(z.enum(['Visa', 'Mastercard', 'Amex', 'RuPay', 'Diners']))
          .default([]),
        valuePct: z.number().nullable().optional(),
        valueFlat: z.number().int().nullable().optional(),
        maxValue: z.number().int().nullable().optional(),
        minTxn: z.number().int().nullable().optional(),
        startsAt: z.string().nullable().optional(),
        endsAt: z.string().nullable().optional(),
      })
    )
    .max(40),
})

export type OfferExtract = z.infer<typeof OfferExtractSchema>
export const fallbackOfferExtract: OfferExtract = { offers: [] }

export function buildOfferExtractPrompt(input: {
  sourceName: string
  sourceUrl: string
  issuerHint?: string
  markdown: string
}) {
  const system = `You extract Indian credit-card and bank offers from a webpage's markdown.

Output strict JSON: { "offers": Offer[] } (max 40 offers).

Offer shape:
- externalId: source-provided id if visible (else null)
- title: short headline (3-280 chars)
- description: 1-2 sentence detail (nullable)
- offerType: one of cashback | instant_discount | reward_multiplier | voucher | bogo | no_cost_emi | milestone | welcome | lounge_access | other
- category: one of food_delivery | dining | grocery | ecommerce_general | fashion | electronics | travel_flight | travel_hotel | travel_cab | fuel | utility | entertainment | health_wellness | education | insurance | lifestyle | other
- merchant: brand name (e.g. "Swiggy", "Amazon India") or null if generic
- cardMention: literal card name if mentioned (e.g. "HDFC Infinia") or null
- eligibleIssuers: array of issuer names (e.g. ["HDFC Bank", "Axis Bank"])
- eligibleNetworks: subset of [Visa, Mastercard, Amex, RuPay, Diners]
- valuePct: percent off/cashback as number (e.g. 10 for 10%) or null
- valueFlat: flat rupee value (integer rupees, no decimals) or null
- maxValue: cap on the offer in rupees (integer) or null
- minTxn: minimum transaction in rupees or null
- startsAt / endsAt: ISO 8601 date string or null

Rules:
- All money is INTEGER RUPEES. No paise, no decimals on flat amounts.
- If offer is "10% up to Rs 500", set valuePct=10 and maxValue=500.
- If offer says "flat Rs 1000 off", set valueFlat=1000.
- Skip generic marketing copy ("Welcome to our offers page"). Only items that actually offer a benefit.
- Do NOT invent issuers or values not present in the source. Use null if unknown.
- If the page mentions an issuer in heading/breadcrumb, propagate it onto each offer that has no explicit mention.
- Prefer 5-25 high-quality offers over 40 noisy ones. Return [] if nothing concrete is on the page.`

  const issuerLine = input.issuerHint
    ? `\nDefault issuer (if not specified per offer): ${input.issuerHint}`
    : ''

  const user = `Source: ${input.sourceName}
URL: ${input.sourceUrl}${issuerLine}

--- BEGIN MARKDOWN ---
${input.markdown.slice(0, 35000)}
--- END MARKDOWN ---`

  return { system, user }
}
