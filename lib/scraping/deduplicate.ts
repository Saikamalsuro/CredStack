import { createHash } from 'node:crypto'

export function offerHash(merchant: string, title: string, validUntil: string | null): string {
  return createHash('sha256')
    .update(`${merchant.toLowerCase()}|${title.trim().toLowerCase()}|${validUntil ?? ''}`)
    .digest('hex')
}
