import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Statement Analyzer — CredStack",
  description: "Upload your credit card statement (PDF). We categorise transactions and surface where to save.",
}

export default function AnalyzerLayout({ children }: { children: ReactNode }) {
  return children
}
