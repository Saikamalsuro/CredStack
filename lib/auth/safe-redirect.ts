/**
 * Validates a redirect path from user input. Only same-origin, relative paths
 * are allowed. Anything else falls back to '/'. Stops open-redirect attacks via
 * `?next=https://evil.example.com`.
 */
export function safeRedirectPath(input: unknown): string {
  if (typeof input !== 'string' || input.length === 0) return '/'
  if (!input.startsWith('/')) return '/'
  if (input.startsWith('//')) return '/'
  if (input.startsWith('/\\')) return '/'
  // Block protocol-relative or scheme-prefixed values once decoded.
  try {
    const decoded = decodeURIComponent(input)
    if (decoded.includes('://')) return '/'
    if (decoded.startsWith('//')) return '/'
  } catch {
    return '/'
  }
  return input
}
