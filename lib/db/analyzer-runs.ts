import { createAdminClient } from './admin'
import { createServerClient } from './server'

export async function createAnalyzerRun(userId: string): Promise<{ id: string }> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('analyzer_runs')
    .insert({ user_id: userId, status: 'queued' })
    .select('id')
    .single()
  if (error) throw error
  return { id: data.id }
}

export async function setAnalyzerRunFile(runId: string, filePath: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('analyzer_runs')
    .update({ uploaded_file_path: filePath })
    .eq('id', runId)
  if (error) throw error
}

export async function getAnalyzerRun(userId: string, runId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('analyzer_runs')
    .select('*')
    .eq('user_id', userId)
    .eq('id', runId)
    .maybeSingle()
  if (error) throw error
  return data
}
