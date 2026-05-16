/**
 * Per-card reward point redemption values (paise per point).
 *
 * Manually curated from public issuer redemption catalogues. Values are best-case
 * for each redemption type; small-print restrictions may reduce realised value.
 */

export interface RedemptionValues {
  cardId: string
  cardName: string
  programName: string
  /** Paise per point for each redemption type. 0 = not available. */
  values: {
    statementCredit: number
    voucher: number
    airlineMiles: number
    hotelPoints: number
    smartBuyOrPartner: number
    productCatalogue: number
  }
  notes?: string
}

export const REDEMPTION: RedemptionValues[] = [
  {
    cardId: "hdfc-infinia",
    cardName: "HDFC Infinia",
    programName: "Reward Points",
    values: {
      statementCredit: 30,
      voucher: 50,
      airlineMiles: 100,
      hotelPoints: 100,
      smartBuyOrPartner: 100,
      productCatalogue: 50,
    },
    notes: "Best value on flights via SmartBuy and 1:1 airline transfers (ITC, Marriott).",
  },
  {
    cardId: "hdfc-diners-club-black",
    cardName: "HDFC Diners Black",
    programName: "Reward Points",
    values: {
      statementCredit: 30,
      voucher: 50,
      airlineMiles: 100,
      hotelPoints: 100,
      smartBuyOrPartner: 100,
      productCatalogue: 50,
    },
    notes: "Same redemption matrix as Infinia.",
  },
  {
    cardId: "hdfc-diners-privilege",
    cardName: "HDFC Diners Privilege",
    programName: "Reward Points",
    values: {
      statementCredit: 25,
      voucher: 40,
      airlineMiles: 50,
      hotelPoints: 50,
      smartBuyOrPartner: 50,
      productCatalogue: 40,
    },
  },
  {
    cardId: "hdfc-regalia-gold",
    cardName: "HDFC Regalia Gold",
    programName: "Reward Points",
    values: {
      statementCredit: 20,
      voucher: 35,
      airlineMiles: 35,
      hotelPoints: 35,
      smartBuyOrPartner: 50,
      productCatalogue: 30,
    },
  },
  {
    cardId: "hdfc-millennia",
    cardName: "HDFC Millennia",
    programName: "CashPoints",
    values: {
      statementCredit: 100,
      voucher: 0,
      airlineMiles: 0,
      hotelPoints: 0,
      smartBuyOrPartner: 100,
      productCatalogue: 0,
    },
    notes: "Cashback card — 1 CashPoint = ₹1, statement credit only.",
  },
  {
    cardId: "hdfc-moneyback-plus",
    cardName: "HDFC MoneyBack+",
    programName: "CashPoints",
    values: {
      statementCredit: 25,
      voucher: 50,
      airlineMiles: 0,
      hotelPoints: 0,
      smartBuyOrPartner: 0,
      productCatalogue: 25,
    },
  },
  {
    cardId: "sbi-elite",
    cardName: "SBI Card ELITE",
    programName: "Reward Points",
    values: {
      statementCredit: 25,
      voucher: 25,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 25,
      productCatalogue: 25,
    },
  },
  {
    cardId: "sbi-prime",
    cardName: "SBI Card PRIME",
    programName: "Reward Points",
    values: {
      statementCredit: 25,
      voucher: 25,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 25,
      productCatalogue: 25,
    },
  },
  {
    cardId: "sbi-cashback",
    cardName: "SBI Cashback Card",
    programName: "Cashback",
    values: {
      statementCredit: 100,
      voucher: 0,
      airlineMiles: 0,
      hotelPoints: 0,
      smartBuyOrPartner: 0,
      productCatalogue: 0,
    },
    notes: "Direct cashback; nothing to redeem.",
  },
  {
    cardId: "icici-emeralde-private-metal",
    cardName: "ICICI Emeralde Private Metal",
    programName: "ICICI Reward Points",
    values: {
      statementCredit: 100,
      voucher: 100,
      airlineMiles: 100,
      hotelPoints: 100,
      smartBuyOrPartner: 100,
      productCatalogue: 100,
    },
    notes: "1 RP = ₹1 across all redemption types. Strongest 1:1 redemption in India.",
  },
  {
    cardId: "icici-emeralde",
    cardName: "ICICI Emeralde",
    programName: "ICICI Reward Points",
    values: {
      statementCredit: 40,
      voucher: 100,
      airlineMiles: 40,
      hotelPoints: 40,
      smartBuyOrPartner: 60,
      productCatalogue: 40,
    },
  },
  {
    cardId: "icici-sapphiro",
    cardName: "ICICI Sapphiro",
    programName: "ICICI Reward Points",
    values: {
      statementCredit: 25,
      voucher: 50,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 40,
      productCatalogue: 25,
    },
  },
  {
    cardId: "icici-rubyx",
    cardName: "ICICI Rubyx",
    programName: "ICICI Reward Points",
    values: {
      statementCredit: 25,
      voucher: 25,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 25,
      productCatalogue: 25,
    },
  },
  {
    cardId: "icici-coral",
    cardName: "ICICI Coral",
    programName: "ICICI Reward Points",
    values: {
      statementCredit: 25,
      voucher: 25,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 25,
      productCatalogue: 25,
    },
  },
  {
    cardId: "icici-amazon-pay",
    cardName: "Amazon Pay ICICI",
    programName: "Amazon Pay Balance",
    values: {
      statementCredit: 0,
      voucher: 100,
      airlineMiles: 0,
      hotelPoints: 0,
      smartBuyOrPartner: 100,
      productCatalogue: 0,
    },
    notes: "Cashback credited as Amazon Pay balance; effectively 1:1 on Amazon spend.",
  },
  {
    cardId: "axis-magnus",
    cardName: "Axis Magnus",
    programName: "EDGE Reward Points",
    values: {
      statementCredit: 20,
      voucher: 20,
      airlineMiles: 40,
      hotelPoints: 40,
      smartBuyOrPartner: 50,
      productCatalogue: 20,
    },
    notes: "Best value via airline mile transfers (1 EDGE = 5 Marriott / 2 Air India).",
  },
  {
    cardId: "axis-atlas",
    cardName: "Axis Atlas",
    programName: "EDGE Miles",
    values: {
      statementCredit: 0,
      voucher: 0,
      airlineMiles: 100,
      hotelPoints: 100,
      smartBuyOrPartner: 100,
      productCatalogue: 0,
    },
    notes: "Travel-only redemption. 1 EDGE Mile = ₹1 on flights/hotels.",
  },
  {
    cardId: "axis-ace",
    cardName: "Axis ACE",
    programName: "Cashback",
    values: {
      statementCredit: 100,
      voucher: 0,
      airlineMiles: 0,
      hotelPoints: 0,
      smartBuyOrPartner: 0,
      productCatalogue: 0,
    },
  },
  {
    cardId: "axis-flipkart",
    cardName: "Flipkart Axis",
    programName: "Cashback",
    values: {
      statementCredit: 100,
      voucher: 0,
      airlineMiles: 0,
      hotelPoints: 0,
      smartBuyOrPartner: 0,
      productCatalogue: 0,
    },
  },
  {
    cardId: "axis-reserve",
    cardName: "Axis Reserve",
    programName: "EDGE Reward Points",
    values: {
      statementCredit: 20,
      voucher: 20,
      airlineMiles: 40,
      hotelPoints: 40,
      smartBuyOrPartner: 50,
      productCatalogue: 20,
    },
  },
  {
    cardId: "axis-horizon",
    cardName: "Axis Horizon",
    programName: "EDGE Miles",
    values: {
      statementCredit: 0,
      voucher: 0,
      airlineMiles: 100,
      hotelPoints: 100,
      smartBuyOrPartner: 100,
      productCatalogue: 0,
    },
  },
  {
    cardId: "amex-platinum",
    cardName: "Amex Platinum Charge",
    programName: "Membership Rewards",
    values: {
      statementCredit: 30,
      voucher: 50,
      airlineMiles: 50,
      hotelPoints: 50,
      smartBuyOrPartner: 50,
      productCatalogue: 30,
    },
  },
  {
    cardId: "amex-platinum-travel",
    cardName: "Amex Platinum Travel",
    programName: "Membership Rewards",
    values: {
      statementCredit: 30,
      voucher: 50,
      airlineMiles: 50,
      hotelPoints: 50,
      smartBuyOrPartner: 50,
      productCatalogue: 30,
    },
  },
  {
    cardId: "amex-platinum-reserve",
    cardName: "Amex Platinum Reserve",
    programName: "Membership Rewards",
    values: {
      statementCredit: 30,
      voucher: 50,
      airlineMiles: 50,
      hotelPoints: 50,
      smartBuyOrPartner: 50,
      productCatalogue: 30,
    },
  },
  {
    cardId: "amex-membership-rewards",
    cardName: "Amex Membership Rewards",
    programName: "Membership Rewards",
    values: {
      statementCredit: 30,
      voucher: 50,
      airlineMiles: 50,
      hotelPoints: 50,
      smartBuyOrPartner: 50,
      productCatalogue: 30,
    },
  },
  {
    cardId: "amex-smart-earn",
    cardName: "Amex SmartEarn",
    programName: "Membership Rewards",
    values: {
      statementCredit: 25,
      voucher: 50,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 50,
      productCatalogue: 25,
    },
  },
  {
    cardId: "amex-gold-charge",
    cardName: "Amex Gold Charge",
    programName: "Membership Rewards",
    values: {
      statementCredit: 25,
      voucher: 50,
      airlineMiles: 50,
      hotelPoints: 50,
      smartBuyOrPartner: 50,
      productCatalogue: 25,
    },
  },
  {
    cardId: "idfc-wealth",
    cardName: "IDFC Wealth",
    programName: "Reward Points",
    values: {
      statementCredit: 25,
      voucher: 25,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 25,
      productCatalogue: 25,
    },
  },
  {
    cardId: "idfc-select",
    cardName: "IDFC Select",
    programName: "Reward Points",
    values: {
      statementCredit: 25,
      voucher: 25,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 25,
      productCatalogue: 25,
    },
  },
  {
    cardId: "idfc-mayura",
    cardName: "IDFC Mayura",
    programName: "Reward Points",
    values: {
      statementCredit: 25,
      voucher: 25,
      airlineMiles: 25,
      hotelPoints: 25,
      smartBuyOrPartner: 25,
      productCatalogue: 25,
    },
  },
]

export function getRedemption(cardId: string): RedemptionValues | undefined {
  return REDEMPTION.find((r) => r.cardId === cardId)
}
