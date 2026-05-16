import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { rateLimit } from '@/lib/cache/ratelimit'
import { createServerClient } from '@/lib/db/server'
import { createAnalyzerRun, setAnalyzerRunFile } from '@/lib/db/analyzer-runs'
import { inngest } from '@/lib/jobs/client'
import { isSameOrigin } from '@/lib/auth/same-origin'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const user = await requireAuth('/auth/sign-in')

  const limit = await rateLimit('analyzer-upload', user.id, 5, '1 d')
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Daily upload limit (5) reached. Try again tomorrow.' },
      { status: 429 }
    )
  }

  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 413 })
  }
  if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF supported' }, { status: 400 })
  }

  const { id: runId } = await createAnalyzerRun(user.id)
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${user.id}/${runId}/${filename}`

  // User-scoped client → storage RLS enforces only the owner can write to their prefix.
  const supabase = await createServerClient()
  const buffer = await file.arrayBuffer()
  const { error: uploadErr } = await supabase.storage
    .from('statements')
    .upload(filePath, buffer, { contentType: 'application/pdf', upsert: false })
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 })
  }

  await setAnalyzerRunFile(runId, filePath)

  try {
    await inngest.send({
      name: 'analyzer.statement.uploaded',
      data: { runId, userId: user.id, filePath, userCardId: null },
    })
  } catch (err) {
    console.warn('[analyzer] Inngest send failed; run will stay queued', err)
  }

  return NextResponse.json({ runId })
}
