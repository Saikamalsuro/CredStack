import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Eligibility check",
  description: "See which Indian credit cards you are likely to qualify for based on income and credit profile.",
}

export default function EligibilityLayout({ children }: { children: ReactNode }) {
  return children
}
