'use server'

import { db } from '@/lib/db'
import updateActivity from './updateActivity'
import { currentUser } from '@clerk/nextjs'
import { Task } from '@/types/board'

export async function createTask ({
  list_id,
  title,
  description,
  prev_id,
  workspace_id,
  task_id
}: {
  list_id: string
  title: string
  description?: string
  prev_id: string | null
  workspace_id: string
  task_id: string
}) {
  const user = await currentUser()
  if (!user?.id) return
  const activity_id = `activity_${crypto.randomUUID()}`

  await db.execute(
    `
        INSERT INTO task
            (task_id, list_id, title, description, prev_id,timestamp_created)
        VALUES
            (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
    [task_id, list_id, title, description, prev_id]
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
    prev_id,
    timestamp_created: new Date().toISOString()
  } as Task
}
