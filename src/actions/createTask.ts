'use server'

import { db } from '@/lib/db'
import updateActivity from './updateActivity'
import { currentUser } from '@clerk/nextjs'
import { Task } from '@/types/board'

export async function createTask ({
  list_id,
  title,
  description,
  index_order,
  workspace_id
}: {
  list_id: string
  title: string
  description?: string
  index_order?: number
  workspace_id: string
}) {
  const user = await currentUser()
  if (!user?.id) return
  const task_id = `card_${crypto.randomUUID()}`
  const activity_id = `activity_${crypto.randomUUID()}`

  await db.execute(
    `
        INSERT INTO task
            (task_id, list_id, title, description, index_order,timestamp_created)
        VALUES
            (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
    [task_id, list_id, title, description, index_order]
  )

  await updateActivity({
    activity_id,
    workspace_id,
    user_id: user?.id,
    activity_type: 'created',
    activity_info: `Task ${title} created`
  })

  return {
    task_id,
    list_id,
    title,
    description,
    index_order,
    timestamp_created: new Date().toISOString()
  } as Task
}
