export type CardCategory = 
  | "travel" 
  | "cashback" 
  | "rewards" 
  | "business" 
  | "student" 
  | "premium" 
  | "fuel" 
  | "shopping"

export type CardNetwork = "visa" | "mastercard" | "amex" | "rupay" | "discover"

export type CardTier =
  | "entry"
  | "lifestyle"
  | "premium"
  | "super_premium"
  | "secured"
  | "student"

export interface CreditCard {
  id: string
  name: string
  issuer: string
  network: CardNetwork
  category: CardCategory[]
  annualFee: number
  joiningFee: number
  interestRate: {
    min: number
    max: number
  }
  creditLimit: {
    min: number
    max: number
  }
  rewards: {
    type: "points" | "cashback" | "miles"
    rate: number
    description: string
  }
  benefits: string[]
  loungeAccess: {
    domestic: number | "unlimited"
    international: number | "unlimited"
  } | null
  welcomeBonus: string | null
  fuelSurchargeWaiver: boolean
  foreignTransactionFee: number
  minIncome: number
  rating: number
  reviewCount: number
  imageUrl: string
  cardColor: string
  featured: boolean
  popular: boolean
  tier?: CardTier | null
}

export const creditCards: CreditCard[] = [
  {
    id: "hdfc-infinia",
    name: "HDFC Infinia",
    issuer: "HDFC Bank",
    network: "visa",
    category: ["premium", "travel", "rewards"],
    annualFee: 12500,
    joiningFee: 12500,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 800000, max: 5000000 },
    rewards: {
      type: "points",
      rate: 5,
      description: "5 reward points per Rs. 150 spent"
    },
    benefits: [
      "Unlimited airport lounge access worldwide",
      "Golf privileges at premium courses",
      "Concierge services 24/7",
      "Travel insurance up to Rs. 3 Crore",
      "1:1 reward point transfer to airlines",
      "Milestone benefits up to Rs. 50,000"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "12,500 reward points on first transaction",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 3000000,
    rating: 4.9,
    reviewCount: 2847,
    imageUrl: "/cards/hdfc-infinia.jpg",
    cardColor: "from-slate-800 to-slate-900",
    featured: true,
    popular: true
  },
  {
    id: "amex-platinum",
    name: "American Express Platinum",
    issuer: "American Express",
    network: "amex",
    category: ["premium", "travel"],
    annualFee: 60000,
    joiningFee: 60000,
    interestRate: { min: 3.5, max: 3.5 },
    creditLimit: { min: 500000, max: 10000000 },
    rewards: {
      type: "points",
      rate: 5,
      description: "5 Membership Rewards points per Rs. 100"
    },
    benefits: [
      "Taj Epicure Plus membership",
      "Marriott Bonvoy Gold Elite status",
      "Global lounge access with Priority Pass",
      "Fine Hotels & Resorts benefits",
      "Entertainment and dining privileges",
      "Travel and purchase protection"
    ],
    loungeAccess: { domestic: "unlimited", international: "unlimited" },
    welcomeBonus: "Taj vouchers worth Rs. 20,000",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 5000000,
    rating: 4.8,
    reviewCount: 1923,
    imageUrl: "/cards/amex-platinum.jpg",
    cardColor: "from-zinc-400 to-zinc-500",
    featured: true,
    popular: true
  },
  {
    id: "axis-magnus",
    name: "Axis Bank Magnus",
    issuer: "Axis Bank",
    network: "visa",
    category: ["premium", "travel", "rewards"],
    annualFee: 12500,
    joiningFee: 12500,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 500000, max: 3000000 },
    rewards: {
      type: "points",
      rate: 12,
      description: "12 EDGE Points per Rs. 200 spent"
    },
    benefits: [
      "8 complimentary lounge visits per quarter",
      "Meet & Greet service at airports",
      "Golf privileges",
      "24/7 concierge services",
      "Travel insurance coverage",
      "Accelerated rewards on travel bookings"
    ],
    loungeAccess: { domestic: 8, international: 8 },
    welcomeBonus: "25,000 EDGE Points on first spend of Rs. 50,000",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 1800000,
    rating: 4.7,
    reviewCount: 3421,
    imageUrl: "/cards/axis-magnus.jpg",
    cardColor: "from-rose-600 to-rose-700",
    featured: true,
    popular: true
  },
  {
    id: "sbi-elite",
    name: "SBI Card ELITE",
    issuer: "SBI Card",
    network: "visa",
    category: ["premium", "travel", "shopping"],
    annualFee: 4999,
    joiningFee: 4999,
    interestRate: { min: 3.35, max: 3.35 },
    creditLimit: { min: 300000, max: 1500000 },
    rewards: {
      type: "points",
      rate: 5,
      description: "5 reward points per Rs. 100 spent"
    },
    benefits: [
      "Complimentary Club Vistara Silver membership",
      "Airport lounge access",
      "Movie ticket offers",
      "Dining privileges",
      "Fuel surcharge waiver",
      "E-commerce cashback"
    ],
    loungeAccess: { domestic: 8, international: 4 },
    welcomeBonus: "5,000 bonus reward points",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.99,
    minIncome: 1200000,
    rating: 4.5,
    reviewCount: 5632,
    imageUrl: "/cards/sbi-elite.jpg",
    cardColor: "from-blue-600 to-blue-700",
    featured: false,
    popular: true
  },
  {
    id: "icici-amazon-pay",
    name: "Amazon Pay ICICI Credit Card",
    issuer: "ICICI Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description: "5% cashback on Amazon (Prime), 2% on Amazon Pay partners"
    },
    benefits: [
      "No annual or joining fee - lifetime free",
      "5% cashback for Prime members on Amazon",
      "2% cashback at Amazon Pay partners",
      "1% cashback on other spends",
      "No minimum spend requirement",
      "Instant approval for Prime members"
    ],
    loungeAccess: null,
    welcomeBonus: "Rs. 500 Amazon Pay Gift Card",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.6,
    reviewCount: 12453,
    imageUrl: "/cards/amazon-pay.jpg",
    cardColor: "from-amber-500 to-amber-600",
    featured: true,
    popular: true
  },
  {
    id: "hdfc-millennia",
    name: "HDFC Millennia",
    issuer: "HDFC Bank",
    network: "mastercard",
    category: ["cashback", "shopping", "rewards"],
    annualFee: 1000,
    joiningFee: 1000,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 100000, max: 700000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description: "5% cashback on Amazon, Flipkart, Myntra & more"
    },
    benefits: [
      "5% cashback on Amazon, Flipkart, Myntra, Tata CLiQ",
      "2.5% cashback on all online spends",
      "1% cashback on offline spends",
      "Complimentary lounge access",
      "Fuel surcharge waiver",
      "BookMyShow & Swiggy offers"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "1,000 CashPoints on first spend within 30 days",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 400000,
    rating: 4.4,
    reviewCount: 8934,
    imageUrl: "/cards/hdfc-millennia.jpg",
    cardColor: "from-emerald-500 to-teal-500",
    featured: false,
    popular: true
  },
  {
    id: "onecard",
    name: "OneCard",
    issuer: "OneCard",
    network: "visa",
    category: ["cashback", "rewards"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 2.49, max: 3.49 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description: "5X rewards on top spend categories"
    },
    benefits: [
      "Lifetime free metal card",
      "5X rewards on top 2 spend categories",
      "1% on all other spends",
      "Real-time spend notifications",
      "Easy EMI conversions",
      "Full control via mobile app"
    ],
    loungeAccess: null,
    welcomeBonus: "No joining bonus - focus on ongoing rewards",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.5,
    minIncome: 0,
    rating: 4.3,
    reviewCount: 6721,
    imageUrl: "/cards/onecard.jpg",
    cardColor: "from-gray-900 to-black",
    featured: false,
    popular: true
  },
  {
    id: "hdfc-regalia-gold",
    name: "HDFC Regalia Gold",
    issuer: "HDFC Bank",
    network: "visa",
    category: ["travel", "rewards"],
    annualFee: 2500,
    joiningFee: 2500,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 200000, max: 1000000 },
    rewards: {
      type: "points",
      rate: 4,
      description: "4 reward points per Rs. 150 spent"
    },
    benefits: [
      "Complimentary airport lounge access",
      "Golf privileges",
      "Travel insurance",
      "Dining privileges",
      "Fuel surcharge waiver",
      "Concierge services"
    ],
    loungeAccess: { domestic: 12, international: 6 },
    welcomeBonus: "2,500 reward points",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2,
    minIncome: 900000,
    rating: 4.4,
    reviewCount: 4532,
    imageUrl: "/cards/hdfc-regalia-gold.jpg",
    cardColor: "from-yellow-500 to-amber-500",
    featured: false,
    popular: false
  },
  {
    id: "axis-flipkart",
    name: "Flipkart Axis Bank Credit Card",
    issuer: "Axis Bank",
    network: "visa",
    category: ["cashback", "shopping"],
    annualFee: 500,
    joiningFee: 500,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 50000, max: 400000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description: "5% unlimited cashback on Flipkart"
    },
    benefits: [
      "5% unlimited cashback on Flipkart",
      "4% cashback on Myntra & 2GUD",
      "1.5% cashback on all other spends",
      "No upper cap on cashback",
      "Welcome benefit of Rs. 500",
      "4 complimentary lounge visits"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "Rs. 500 Flipkart voucher",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 300000,
    rating: 4.3,
    reviewCount: 7821,
    imageUrl: "/cards/flipkart-axis.jpg",
    cardColor: "from-blue-500 to-indigo-500",
    featured: false,
    popular: true
  },
  {
    id: "icici-sapphiro",
    name: "ICICI Sapphiro",
    issuer: "ICICI Bank",
    network: "visa",
    category: ["premium", "travel"],
    annualFee: 6500,
    joiningFee: 6500,
    interestRate: { min: 3.4, max: 3.4 },
    creditLimit: { min: 300000, max: 2000000 },
    rewards: {
      type: "points",
      rate: 4,
      description: "4 PAYBACK Points per Rs. 100 spent"
    },
    benefits: [
      "Complimentary domestic lounge access",
      "2 international lounge visits per quarter",
      "Golf privileges",
      "Concierge services",
      "Travel insurance",
      "Movie ticket offers"
    ],
    loungeAccess: { domestic: "unlimited", international: 8 },
    welcomeBonus: "6,500 PAYBACK Points",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.8,
    minIncome: 1500000,
    rating: 4.5,
    reviewCount: 3214,
    imageUrl: "/cards/icici-sapphiro.jpg",
    cardColor: "from-indigo-600 to-indigo-700",
    featured: false,
    popular: false
  },
  {
    id: "indusind-legend",
    name: "IndusInd Legend",
    issuer: "IndusInd Bank",
    network: "mastercard",
    category: ["premium", "travel", "rewards"],
    annualFee: 5999,
    joiningFee: 5999,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 400000, max: 2500000 },
    rewards: {
      type: "points",
      rate: 3,
      description: "3 reward points per Rs. 100 spent"
    },
    benefits: [
      "Unlimited domestic lounge access",
      "International lounge access",
      "Golf privileges",
      "Complimentary Zomato Gold",
      "Travel & purchase protection",
      "Concierge services"
    ],
    loungeAccess: { domestic: "unlimited", international: 4 },
    welcomeBonus: "Gift vouchers worth Rs. 4,000",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 2.5,
    minIncome: 1500000,
    rating: 4.4,
    reviewCount: 2156,
    imageUrl: "/cards/indusind-legend.jpg",
    cardColor: "from-purple-600 to-purple-700",
    featured: false,
    popular: false
  },
  {
    id: "au-lit",
    name: "AU Small Finance Bank LIT",
    issuer: "AU Bank",
    network: "visa",
    category: ["cashback", "rewards"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 30000, max: 300000 },
    rewards: {
      type: "cashback",
      rate: 3,
      description: "Choose your own rewards - 3 features you want"
    },
    benefits: [
      "Customizable rewards - pick 3 features",
      "Lifetime free",
      "Airport lounge access (if selected)",
      "Fuel surcharge waiver (if selected)",
      "Railway lounge access (if selected)",
      "Insurance cover (if selected)"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "Customizable welcome benefit",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3,
    minIncome: 0,
    rating: 4.2,
    reviewCount: 3456,
    imageUrl: "/cards/au-lit.jpg",
    cardColor: "from-orange-500 to-red-500",
    featured: false,
    popular: false
  },
  {
    id: "sbi-cashback",
    name: "SBI Cashback",
    issuer: "SBI Card",
    network: "visa",
    category: ["cashback"],
    annualFee: 999,
    joiningFee: 999,
    interestRate: { min: 3.35, max: 3.35 },
    creditLimit: { min: 100000, max: 500000 },
    rewards: {
      type: "cashback",
      rate: 5,
      description: "5% cashback on all online spends"
    },
    benefits: [
      "5% cashback on online spends",
      "1% cashback on all other spends",
      "No upper limit on cashback",
      "Fuel surcharge waiver",
      "EMI conversion facility",
      "Lounge access"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "Rs. 500 cashback on first transaction",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 500000,
    rating: 4.3,
    reviewCount: 5678,
    imageUrl: "/cards/sbi-cashback.jpg",
    cardColor: "from-blue-700 to-blue-800",
    featured: false,
    popular: false
  },
  {
    id: "idfc-millennia",
    name: "IDFC FIRST Millennia",
    issuer: "IDFC FIRST Bank",
    network: "visa",
    category: ["cashback", "rewards"],
    annualFee: 0,
    joiningFee: 0,
    interestRate: { min: 0.75, max: 3.49 },
    creditLimit: { min: 50000, max: 500000 },
    rewards: {
      type: "points",
      rate: 10,
      description: "10X rewards on partner brands"
    },
    benefits: [
      "Lifetime free card",
      "10X rewards on partner brands",
      "6X on travel, dining, grocery",
      "Lowest interest rates in India",
      "Never expiring rewards",
      "Lounge access"
    ],
    loungeAccess: { domestic: 4, international: 0 },
    welcomeBonus: "Activation bonus up to Rs. 1,500",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 1.5,
    minIncome: 300000,
    rating: 4.4,
    reviewCount: 4321,
    imageUrl: "/cards/idfc-millennia.jpg",
    cardColor: "from-red-600 to-rose-600",
    featured: false,
    popular: true
  },
  {
    id: "hsbc-smart-value",
    name: "HSBC Smart Value",
    issuer: "HSBC",
    network: "visa",
    category: ["fuel", "cashback"],
    annualFee: 750,
    joiningFee: 750,
    interestRate: { min: 3.49, max: 3.49 },
    creditLimit: { min: 100000, max: 600000 },
    rewards: {
      type: "cashback",
      rate: 25,
      description: "25% cashback on fuel (up to Rs. 500/month)"
    },
    benefits: [
      "25% cashback on fuel transactions",
      "10% cashback on grocery & dining",
      "3% cashback on all other spends",
      "Annual fee waiver on Rs. 50K spend",
      "Complimentary lounge access",
      "Purchase protection"
    ],
    loungeAccess: { domestic: 2, international: 0 },
    welcomeBonus: "Rs. 1,000 cashback on Rs. 5,000 spend",
    fuelSurchargeWaiver: true,
    foreignTransactionFee: 3.5,
    minIncome: 400000,
    rating: 4.2,
    reviewCount: 1876,
    imageUrl: "/cards/hsbc-smart-value.jpg",
    cardColor: "from-red-500 to-red-600",
    featured: false,
    popular: false
  }
]

export function getCardById(id: string): CreditCard | undefined {
  return creditCards.find(card => card.id === id)
}

export function getCardsByCategory(category: CardCategory): CreditCard[] {
  return creditCards.filter(card => card.category.includes(category))
}

export function getFeaturedCards(): CreditCard[] {
  return creditCards.filter(card => card.featured)
}

export function getPopularCards(): CreditCard[] {
  return creditCards.filter(card => card.popular)
}

export function searchCards(query: string): CreditCard[] {
  const lowercaseQuery = query.toLowerCase()
  return creditCards.filter(card => 
    card.name.toLowerCase().includes(lowercaseQuery) ||
    card.issuer.toLowerCase().includes(lowercaseQuery) ||
    card.category.some(cat => cat.toLowerCase().includes(lowercaseQuery))
  )
}

export function sortCards(
  cards: CreditCard[], 
  sortBy: "rating" | "annualFee" | "rewards" | "name"
): CreditCard[] {
  return [...cards].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "annualFee":
        return a.annualFee - b.annualFee
      case "rewards":
        return b.rewards.rate - a.rewards.rate
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
}

export function filterCards(
  cards: CreditCard[],
  filters: {
    categories?: CardCategory[]
    networks?: CardNetwork[]
    tiers?: CardTier[]
    maxAnnualFee?: number
    hasLoungeAccess?: boolean
    noAnnualFee?: boolean
    minRating?: number
  }
): CreditCard[] {
  return cards.filter(card => {
    if (filters.categories?.length && !filters.categories.some(cat => card.category.includes(cat))) {
      return false
    }
    if (filters.networks?.length && !filters.networks.includes(card.network)) {
      return false
    }
    if (filters.tiers?.length && (!card.tier || !filters.tiers.includes(card.tier))) {
      return false
    }
    if (filters.maxAnnualFee !== undefined && card.annualFee > filters.maxAnnualFee) {
      return false
    }
    if (filters.hasLoungeAccess && !card.loungeAccess) {
      return false
    }
    if (filters.noAnnualFee && card.annualFee > 0) {
      return false
    }
    if (filters.minRating && card.rating < filters.minRating) {
      return false
    }
    return true
  })
}
