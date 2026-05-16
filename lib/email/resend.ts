import { Resend } from 'resend'

let cached: Resend | null = null

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!cached) cached = new Resend(key)
  return cached
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
}

export interface DueReminderEmail {
  to: string
  fullName: string | null
  cardName: string
  dueDate: string
  amount: number
  daysLeft: number
}

export async function sendDueReminderEmail(input: DueReminderEmail): Promise<{ id?: string; error?: string }> {
  const resend = getResend()
  if (!resend) return { error: 'RESEND_API_KEY missing' }

  const subject =
    input.daysLeft <= 1
      ? `Due tomorrow: ${input.cardName} — ₹${input.amount.toLocaleString('en-IN')}`
      : `${input.cardName} due in ${input.daysLeft} days`

  const html = `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
  <h2 style="margin:0 0 12px;font-size:20px">${subject}</h2>
  <p style="margin:0 0 8px;color:#444">${input.fullName ? `Hi ${input.fullName.split(' ')[0]},` : 'Hi,'}</p>
  <p style="margin:0 0 16px;color:#444">Your <strong>${input.cardName}</strong> credit card payment is due on <strong>${new Date(input.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:6px 0;color:#666">Amount due</td><td style="padding:6px 0;text-align:right;font-weight:600">₹${input.amount.toLocaleString('en-IN')}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Days left</td><td style="padding:6px 0;text-align:right;font-weight:600">${input.daysLeft}</td></tr>
  </table>
  <p style="margin:16px 0;color:#444">Pay via your bank app to avoid late fees (₹500-1000) and CIBIL impact.</p>
  <p style="margin:24px 0 8px;font-size:12px;color:#888">Sent by CredStack — your credit-card command centre.</p>
  <p style="margin:0;font-size:12px;color:#888"><a href="https://credstack.in/dashboard/cards" style="color:#0066cc">Manage portfolio</a> · <a href="https://credstack.in/dashboard/privacy" style="color:#0066cc">Unsubscribe</a></p>
</div>`.trim()

  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: input.to,
      subject,
      html,
    })
    if (error) return { error: error.message }
    return { id: data?.id }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Send failed' }
  }
}
