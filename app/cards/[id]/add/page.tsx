import { notFound, redirect } from "next/navigation"
import { getCardById } from "@/lib/db/cards"
import { getCurrentUser } from "@/lib/auth/helpers"
import { AddCardForm } from "./add-card-form"

interface AddCardPageProps {
  params: Promise<{ id: string }>
}

export default async function AddCardPage({ params }: AddCardPageProps) {
  const { id } = await params

  const user = await getCurrentUser()
  if (!user) {
    redirect(`/auth/sign-in?redirect=/cards/${id}/add`)
  }

  const card = await getCardById(id)
  if (!card) notFound()

  return <AddCardForm card={card} />
}
