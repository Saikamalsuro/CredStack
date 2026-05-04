/**
 * Bank "Apply Now" URLs per card slug.
 *
 * Source-controlled mirror of `cards.apply_url` in Supabase. UI imports
 * the helpers; the seed script (`scripts/seed-apply-urls.ts`) syncs the
 * same map into the DB column.
 *
 * Last verified: May 2026.
 */

// Canonical slugs use the form stored in the DB.
export const cardApplyUrls: Record<string, string> = {
  // HDFC Bank
  'hdfc-infinia':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-metal-edition',
  'hdfc-diners-club-black':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-club-black-metal-edition-credit-card',
  'hdfc-diners-privilege':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-privilege-credit-card',
  'hdfc-regalia-gold':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card',
  'hdfc-millennia':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card',
  'hdfc-moneyback-plus':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/moneyback-plus-credit-card',
  'tata-neu-infinity-hdfc':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/tata-neu-infinity-hdfc-bank-credit-card',
  'hdfc-tata-neu-plus':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/tata-neu-plus-hdfc-bank-credit-card',
  'hdfc-irctc':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/irctc-hdfc-bank-credit-card',
  'hdfc-indianoil':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/indianoil-hdfc-bank-credit-card',
  'hdfc-swiggy':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/swiggy-hdfc-bank-credit-card',
  'hdfc-6e-rewards-xl':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/6e-rewards-xl-indigo-hdfc-bank-credit-card',
  'marriott-bonvoy-hdfc':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/marriott-bonvoy-hdfc-bank-credit-card',
  'hdfc-pixel':
    'https://www.hdfcbank.com/personal/pay/cards/credit-cards/pixel-play-credit-card',

  // SBI Card
  'sbi-elite':
    'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-elite.page',
  'sbi-prime':
    'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page',
  'sbi-cashback':
    'https://www.sbicard.com/en/personal/credit-cards/shopping/cashback-sbi-card.page',
  'sbi-simplyclick':
    'https://www.sbicard.com/en/personal/credit-cards/shopping/simplyclick-sbi-card.page',
  'sbi-simplysave':
    'https://www.sbicard.com/en/personal/credit-cards/shopping/simplysave-sbi-card.page',
  'sbi-bpcl':
    'https://www.sbicard.com/en/personal/credit-cards/travel/bpcl-sbi-card.page',
  'sbi-bpcl-octane':
    'https://www.sbicard.com/en/personal/credit-cards/travel/bpcl-sbi-card-octane.page',
  'irctc-sbi-platinum':
    'https://www.sbicard.com/en/personal/credit-cards/travel/irctc-sbi-card-premier.page',
  'sbi-pulse':
    'https://www.sbicard.com/en/personal/credit-cards/lifestyle/sbi-card-pulse.page',
  'sbi-reliance-prime':
    'https://www.sbicard.com/en/personal/credit-cards/shopping/reliance-sbi-card-prime.page',

  // ICICI Bank
  'icici-emeralde-private-metal':
    'https://www.icicibank.com/personal-banking/cards/credit-card/emeralde-private-metal-credit-card',
  'icici-emeralde':
    'https://www.icicibank.com/personal-banking/cards/credit-card/emeralde-credit-card',
  'icici-sapphiro':
    'https://www.icicibank.com/personal-banking/cards/credit-card/sapphiro-credit-card',
  'icici-rubyx':
    'https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card',
  'icici-coral':
    'https://www.icicibank.com/personal-banking/cards/credit-card/coral-credit-card',
  'icici-platinum-chip':
    'https://www.icicibank.com/personal-banking/cards/credit-card/platinum-chip-credit-card',
  'icici-amazon-pay':
    'https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-credit-card',
  'icici-mmt-signature':
    'https://www.icicibank.com/personal-banking/cards/credit-card/makemytrip/signature-credit-card',
  'icici-hpcl-supersaver':
    'https://www.icicibank.com/personal-banking/cards/credit-card/hpcl-super-saver-credit-card',

  // Axis Bank
  'axis-magnus':
    'https://www.axisbank.com/cards/credit-card/axis-bank-magnus-credit-card',
  'axis-atlas':
    'https://www.axisbank.com/cards/credit-card/axis-bank-atlas-credit-card',
  'axis-ace':
    'https://www.axisbank.com/cards/credit-card/axis-bank-ace-credit-card',
  'axis-flipkart':
    'https://www.axisbank.com/cards/credit-card/flipkart-axis-bank-credit-card',
  'axis-reserve':
    'https://www.axisbank.com/cards/credit-card/reserve-credit-card',
  'axis-vistara-signature':
    'https://www.axisbank.com/cards/credit-card/axis-bank-vistara-credit-card',
  'axis-privilege':
    'https://www.axisbank.com/cards/credit-card/privilege-credit-card',
  'axis-select':
    'https://www.axisbank.com/cards/credit-card/select-credit-card',
  'axis-myzone':
    'https://www.axisbank.com/cards/credit-card/myzone-credit-card',
  'axis-indianoil':
    'https://www.axisbank.com/cards/credit-card/indianoil-axis-bank-premium-credit-card',
  'axis-horizon':
    'https://www.axisbank.com/cards/credit-card/axis-bank-horizon-credit-card',
  'axis-samsung':
    'https://www.axisbank.com/cards/credit-card/samsung-axis-bank-infinite-credit-card',

  // American Express
  'amex-platinum':
    'https://www.americanexpress.com/in/credit-cards/platinum-card/',
  'amex-platinum-travel':
    'https://www.americanexpress.com/in/credit-cards/platinum-travel-credit-card/',
  'amex-gold-charge':
    'https://www.americanexpress.com/in/credit-cards/gold-card/',
  'amex-membership-rewards':
    'https://www.americanexpress.com/in/credit-cards/membership-rewards-credit-card/',
  'amex-smart-earn':
    'https://www.americanexpress.com/in/credit-cards/smart-earn-credit-card/',
  'amex-platinum-reserve':
    'https://www.americanexpress.com/in/credit-cards/platinum-reserve-credit-card/',

  // Kotak Mahindra Bank
  'kotak-white':
    'https://www.kotak.com/en/personal-banking/cards/credit-cards/white-credit-card.html',
  'kotak-league-platinum':
    'https://www.kotak.com/en/personal-banking/cards/credit-cards/league-platinum-card.html',
  'kotak-indianoil':
    'https://www.kotak.com/en/personal-banking/cards/credit-cards/indianoil-kotak-credit-card.html',
  'kotak-myntra':
    'https://www.kotak.com/en/personal-banking/cards/credit-cards/myntra-kotak-credit-card.html',

  // IDFC FIRST Bank
  'idfc-wealth': 'https://www.idfcfirstbank.com/credit-card/wealth',
  'idfc-ashva': 'https://www.idfcfirstbank.com/credit-card/ashva',
  'idfc-millennia': 'https://www.idfcfirstbank.com/credit-card/millennia',
  'idfc-select': 'https://www.idfcfirstbank.com/credit-card/select',
  'idfc-wow': 'https://www.idfcfirstbank.com/credit-card/wow',
  'idfc-power': 'https://www.idfcfirstbank.com/credit-card/power',
  'idfc-power-plus': 'https://www.idfcfirstbank.com/credit-card/power-plus',
  'idfc-mayura': 'https://www.idfcfirstbank.com/credit-card/mayura',

  // YES Bank
  'yes-marquee':
    'https://www.yesbank.in/credit-cards/yes-bank-marquee-credit-card',
  'yes-reserv':
    'https://www.yesbank.in/credit-cards/yes-bank-reserv-credit-card',
  'yes-ace': 'https://www.yesbank.in/credit-cards/yes-bank-ace-credit-card',

  // IndusInd Bank
  'indusind-legend':
    'https://www.indusind.com/in/en/personal/cards/credit-card/legend-credit-card.html',
  'indusind-pinnacle':
    'https://www.indusind.com/in/en/personal/cards/credit-card/pinnacle-world-credit-card.html',
  'indusind-tiger':
    'https://www.indusind.com/in/en/personal/cards/credit-card/tiger-credit-card.html',
  'indusind-pioneer-heritage':
    'https://www.indusind.com/in/en/personal/cards/credit-card/pioneer-heritage-credit-card.html',

  // RBL Bank
  'rbl-world-safari':
    'https://www.rblbank.com/category/credit-cards/world-safari-credit-card',
  'rbl-insignia':
    'https://www.rblbank.com/category/credit-cards/insignia-preferred-banking-credit-card',
  'rbl-icon': 'https://www.rblbank.com/category/credit-cards/icon-credit-card',
  'rbl-shoprite':
    'https://www.rblbank.com/category/credit-cards/shoprite-credit-card',

  // Standard Chartered Bank
  'stanchart-smart': 'https://www.sc.com/in/credit-cards/smart-credit-card/',

  // Federal Bank / Scapia
  'federal-scapia': 'https://scapia.cards/credit-card',

  // Bank of Baroda
  'bob-eterna': 'https://www.bobcard.co.in/credit-cards/eterna-credit-card',
  'bob-premier': 'https://www.bobcard.co.in/credit-cards/premier-credit-card',

  // HSBC Bank India
  'hsbc-smart-value': 'https://www.hsbc.co.in/credit-cards/products/smart-value/',
  'hsbc-live-plus': 'https://www.hsbc.co.in/credit-cards/products/live-plus/',

  // AU Small Finance Bank
  'au-lit': 'https://www.aubank.in/personal-banking/credit-cards/lit-credit-card',
  'au-ixigo':
    'https://www.aubank.in/personal-banking/credit-cards/ixigo-au-credit-card',

  // OneCard
  onecard: 'https://www.getonecard.app/',
}

/** Cards that require an invitation; UI shows "Express Interest". */
export const inviteOnlyCards: ReadonlySet<string> = new Set([
  'hdfc-infinia',
  'icici-emeralde-private-metal',
  'indusind-pioneer-heritage',
  'rbl-insignia',
])

/** Cards no longer accepting new applications; UI shows disabled state. */
export const discontinuedForNewApplications: ReadonlySet<string> = new Set([
  'icici-mmt-signature',
])

export function getApplyUrl(cardId: string): string | null {
  return cardApplyUrls[cardId] ?? null
}

export function isInviteOnly(cardId: string): boolean {
  return inviteOnlyCards.has(cardId)
}

export function isDiscontinued(cardId: string): boolean {
  return discontinuedForNewApplications.has(cardId)
}
