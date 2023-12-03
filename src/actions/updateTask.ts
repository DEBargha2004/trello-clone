'use server'

import { db } from '@/lib/db'
import { Task } from '@/types/board'
import updateActivity from './updateActivity'
import { currentUser } from '@clerk/nextjs'

export async function updateTaskPosition (
  {
    ...props
  }: {
    list_id: string
    title?: string
    prev_id?: string | null
    description?: string
  },
  { ...prev_info }: Task
) {
  const user = await currentUser()
  if (!user?.id) return

  await db.execute(
    `UPDATE task SET prev_id = ?,list_id = ? WHERE task_id = ?`,
    [props.prev_id, props.list_id, prev_info.task_id]
  )
}
