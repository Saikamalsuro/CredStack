export interface TaxYearTransaction {
  date: string
  merchant: string
  category: string
  amount: number
  cardName: string
}

export interface TaxYearCategoryAgg {
  category: string
  count: number
  total: number
}

export interface TaxYearReport {
  fyStart: string
  fyEnd: string
  totalSpend: number
  totalRewards: number
  forexSpend: number
  byCategory: TaxYearCategoryAgg[]
  transactions: TaxYearTransaction[]
}
