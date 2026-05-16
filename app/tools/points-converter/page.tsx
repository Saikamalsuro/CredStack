import type { Metadata } from "next"
import { REDEMPTION } from "@/lib/data/reward-redemption"
import { PointsConverterClient } from "./points-converter-client"

export const metadata: Metadata = {
  title: "Reward Points Value Calculator — Indian Credit Cards | CredStack",
  description:
    "Convert reward points to rupee value for HDFC, SBI, ICICI, Axis, Amex, IDFC. Compare statement credit vs vouchers vs airline miles redemption.",
}

export const revalidate = 86400

export default function PointsConverterPage() {
  return <PointsConverterClient cards={REDEMPTION} />
}
