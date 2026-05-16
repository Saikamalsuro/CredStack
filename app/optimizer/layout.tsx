import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Spend Optimizer — CredStack",
  description: "Reshape your spending across cards to maximise rewards without changing how much you spend.",
}

export default function OptimizerLayout({ children }: { children: ReactNode }) {
  return children
}
