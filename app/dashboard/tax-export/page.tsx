import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/db/server"
import { getTaxYearReport } from "@/lib/db/tax-export"
import { TaxExportClient } from "./tax-export-client"

export const metadata: Metadata = {
  title: "Tax Export — Annual Summary | CredStack",
  description: "Download an ITR-ready summary of your credit card spending for the Indian financial year.",
}

interface Props {
  searchParams: Promise<{ fy?: string }>
}

function defaultFyStartYear(now = new Date()): number {
  // Indian FY: April–March. If current month is Jan-Mar, FY started previous calendar year.
  const month = now.getMonth() + 1
  return month < 4 ? now.getFullYear() - 1 : now.getFullYear()
}

export default async function TaxExportPage({ searchParams }: Props) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/tax-export")

  const { fy } = await searchParams
  const fyStartYear = fy ? Number(fy) : defaultFyStartYear()
  const report = await getTaxYearReport(user.id, fyStartYear)

  const currentDefault = defaultFyStartYear()
  const fyOptions = [currentDefault, currentDefault - 1, currentDefault - 2]

  return <TaxExportClient report={report} fyStartYear={fyStartYear} fyOptions={fyOptions} />
}
