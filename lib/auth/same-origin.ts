/**
 * Reject cross-origin requests to authenticated POST/PUT/DELETE handlers.
 * Browsers send the Origin header on state-changing requests automatically;
 * a request from a malicious site embedded in an <iframe> or script call
 * will therefore have an Origin that doesn't match our host.
 *
 * GET requests are intentionally not checked — those are idempotent and the
 * same-origin Fetch policy already covers most cases. State-changing routes
 * call this guard before doing any work.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // non-browser clients (curl, Inngest) skip Origin

  const host = request.headers.get('host')
  if (!host) return false

  try {
    const originUrl = new URL(origin)
    if (originUrl.host === host) return true
  } catch {
    return false
  }

  // Allow Vercel preview deployments + production custom domain when set.
  const allow = process.env.NEXT_PUBLIC_SITE_URL
  if (allow) {
    try {
      const allowedHost = new URL(allow).host
      if (new URL(origin).host === allowedHost) return true
    } catch {
      /* ignore */
    }
  }

  return false
}
