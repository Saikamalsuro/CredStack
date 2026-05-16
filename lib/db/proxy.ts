import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'

// Anything matching these prefixes is reachable without authentication.
// Auth-gated areas (everything under /dashboard, server actions for cards,
// account routes) are NOT listed here.
const PUBLIC_PREFIXES = [
  '/auth/',
  '/api/auth/',
  '/api/inngest',
  '/api/cron/',
  '/api/cards',
  '/api/offers',
  '/api/banks',
  '/api/eligibility',
  '/api/advisor',
  '/cards',
  '/compare',
  '/banks',
  '/advisor',
  '/analyzer',
  '/optimizer',
  '/eligibility',
  '/offers',
  '/methodology',
  '/learn',
  '/rewards',
  '/safety',
  '/apply',
  '/tools',
  '/about',
  '/contact',
  '/faq',
  '/help',
  '/docs',
  '/careers',
  '/press',
  '/blog',
  '/privacy',
  '/terms',
  '/cookies',
  '/disclaimer',
]

const PUBLIC_EXACT = ['/', '/sitemap.xml', '/robots.txt']
const AUTH_ROUTES = ['/auth/sign-in', '/auth/sign-up']

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`) || pathname === p
  )
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Unauthenticated: only auth flow + Inngest webhook + SEO files allowed
  if (!user && !isPublic(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/sign-in'
    url.searchParams.set('redirect', pathname === '/auth/sign-in' ? '/' : pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated user landing on sign-in / sign-up: send to home
  if (user && AUTH_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}
