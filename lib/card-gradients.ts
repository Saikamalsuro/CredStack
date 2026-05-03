/**
 * Static list of every Tailwind gradient string used by cards in the
 * Supabase catalog. The CreditCardVisual component reads
 * `card.cardColor` (which comes from `cards.card_color_gradient` in the
 * DB) and applies it as a className. Tailwind's content scanner only
 * generates utility classes it can find in source — strings that exist
 * exclusively in the database are stripped from the production CSS.
 *
 * Listing them here as plain string literals makes Tailwind ship every
 * one of them. Keep this file in sync with the gradients seeded in DB.
 */
export const CARD_GRADIENTS = [
  "from-amber-600 via-yellow-700 to-orange-800",
  "from-stone-700 via-stone-800 to-neutral-900",
  "from-slate-500 via-slate-600 to-slate-800",
  "from-pink-600 via-fuchsia-600 to-violet-700",
  "from-sky-700 via-blue-700 to-blue-900",
  "from-cyan-700 to-blue-800",
  "from-blue-600 via-yellow-500 to-blue-700",
  "from-purple-900 via-purple-800 to-indigo-900",
  "from-violet-700 to-fuchsia-700",
  "from-zinc-900 to-black",
  "from-slate-700 to-slate-800",
  "from-slate-800 via-slate-900 to-black",
  "from-cyan-600 via-blue-600 to-indigo-700",
  "from-yellow-700 via-amber-600 to-yellow-800",
  "from-red-700 via-red-800 to-rose-900",
  "from-orange-500 via-orange-600 to-zinc-800",
  "from-emerald-700 via-teal-700 to-green-800",
  "from-emerald-800 to-teal-900",
  "from-blue-700 via-sky-600 to-cyan-700",
  "from-stone-700 to-zinc-900",
  "from-rose-600 via-pink-600 to-rose-700",
  "from-rose-700 to-pink-800",
  "from-red-900 via-rose-800 to-red-700",
  "from-blue-800 to-indigo-900",
  "from-neutral-700 via-zinc-800 to-slate-900",
  "from-amber-900 to-yellow-900",
  "from-zinc-700 via-zinc-800 to-zinc-900",
  "from-amber-700 to-orange-800",
  "from-orange-600 via-yellow-700 to-red-700",
  "from-emerald-700 via-green-700 to-teal-800",
  "from-amber-900 via-yellow-800 to-amber-700",
  "from-indigo-700 to-blue-800",
  "from-green-700 to-emerald-800",
  "from-purple-700 to-fuchsia-700",
  "from-violet-800 to-purple-900",
] as const

export type CardGradient = (typeof CARD_GRADIENTS)[number]
