import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@/lib/db/server'
import { safeRedirectPath } from '@/lib/auth/safe-redirect'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeRedirectPath(searchParams.get('next'))

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('next')

  if (tokenHash && type) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(redirectTo)
    }
  }

  redirectTo.pathname = '/auth/error'
  return NextResponse.redirect(redirectTo)
}
