'use server'

import { db } from '@/lib/db'

export default async function updateActivity ({
  workspace_id,
  user_id,
  activity_id,
  activity_type,
  activity_info
}: {
  workspace_id: string
  user_id: string
  activity_id: string
  activity_type: 'created' | 'updated' | 'deleted'
  activity_info: string
}) {
  await db.execute(
    `
        insert into activity_log
            (workspace_id, user_id, activity_id, activity_type,activity_info, timestamp)
        values
            (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    [workspace_id, user_id, activity_id, activity_type, activity_info]
  )
}
