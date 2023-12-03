'use server'

import { db } from '@/lib/db'
import updateActivity from './updateActivity'
import { currentUser } from '@clerk/nextjs'
import { List } from '@/types/board'

export async function createNewList (
  title: string,
  board_id: string,
  prev_id: string,
  workspace_id: string,
  list_id: string
) {
  const userInfo = await currentUser()
  if (!userInfo?.id) return

  const activity_id = `activity_${crypto.randomUUID()}`

  await db.execute(
    `
    INSERT INTO list 
        (list_id,board_id,title,prev_id) 
    VALUES 
        (?,?,?,?)
    `,
    [list_id, board_id, title, prev_id]
  )

  await updateActivity({
    workspace_id,
    user_id: userInfo?.id,
    activity_id,
    activity_info: `List ${title} created`,
    activity_type: 'created'
  })

  return {
    list_id,
    title,
    prev_id,
    tasks: []
  } as List
}
