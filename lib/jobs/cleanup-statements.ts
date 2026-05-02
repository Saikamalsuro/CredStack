import { inngest } from './client'
import { createAdminClient } from '@/lib/db/admin'

export const cleanupOldStatements = inngest.createFunction(
  {
    id: 'cleanup-old-statements',
    triggers: [{ cron: '0 2 * * *' }],
  },
  async () => {
    const supabase = createAdminClient()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: runs, error } = await supabase
      .from('analyzer_runs')
      .select('id, uploaded_file_path')
      .lt('created_at', sevenDaysAgo)
      .not('uploaded_file_path', 'is', null)

    if (error) throw error

    const removed: string[] = []
    for (const run of runs ?? []) {
      if (!run.uploaded_file_path) continue
      const { error: delErr } = await supabase.storage
        .from('statements')
        .remove([run.uploaded_file_path])
      if (!delErr) {
        await supabase
          .from('analyzer_runs')
          .update({ uploaded_file_path: null })
          .eq('id', run.id)
        removed.push(run.uploaded_file_path)
      }
    }

    return { removed: removed.length }
  }
)
