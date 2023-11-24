'use server'

import { db } from '@/lib/db'
import { WorkSpaceType } from '@/types/workspace'
import { currentUser } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'

export async function createWorkspace (title: string, description?: string) {
  const userInfo = await currentUser()

  if (!userInfo?.id || title === '') return

  const workspace_id = `workspace_${crypto.randomUUID()}`
  const { rows, headers } = await db.execute(
    `insert into workspace 
        (workspace_id, title,description,timestamp_created,private, creator_user_id) 
    values 
        (?, ?, ?, CURRENT_TIMESTAMP,1, ?)`,
    [workspace_id, title, description, userInfo.id]
  )

  await db.execute(
    `insert into workspace_members 
            (workspace_id, user_id) 
        values 
            (?, ?)`,
    [workspace_id, userInfo.id]
  )

  const activityId = `activity_${crypto.randomUUID()}`

  await db.execute(
    `insert into activity_log
            (workspace_id, user_id, activity_id, activity_type,activity_info, timestamp)
        values
            (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [workspace_id, userInfo.id, activityId, 'created', 'Workspace created']
  )

  console.log(rows)

  rows.forEach((row, index) => {
    //@ts-ignore
    delete row[index][headers[0]]
  })

  console.log(rows, Date.now())

  return [
    {
      workspace_id,
      title,
      description,
      boards: [],
      private: 1,
      creator: {
        user_id: userInfo.id,
        firstname: userInfo.firstName,
        lastname: userInfo.lastName
      },
      creator_user_id: userInfo.id
    }
  ] as WorkSpaceType[]

  // return rows as unknown as WorkSpaceType[]
}
