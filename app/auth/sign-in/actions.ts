'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createServerClient } from '@/lib/db/server'

export async function login(formData: FormData) {
  const supabase = await createServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirect') as string) || '/dashboard'

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/auth/sign-in?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function loginWithGoogle(formData: FormData) {
  const supabase = await createServerClient()
  const headerList = await headers()
  const origin = headerList.get('origin') ?? headerList.get('host')
  const redirectTo = (formData.get('redirect') as string) || '/dashboard'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    redirect(`/auth/sign-in?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
