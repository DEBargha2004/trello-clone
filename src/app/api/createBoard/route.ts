import updateActivity from '@/actions/updateActivity'
import { db } from '@/lib/db'
import { BoardDatabase } from '@/types/board'
import { auth } from '@clerk/nextjs'

export async function POST (req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const {
    title,
    workspace_id,
    background_type,
    background_info,
    description
  }: BoardDatabase = await req.json()

  const board_id = `board_${crypto.randomUUID()}`
  const activity_id = `activity_${crypto.randomUUID()}`

  try {
    await db.execute(
      `
        INSERT INTO board 
            (
                board_id,
                workspace_id,
                title,
                description,
                background_type,
                background_info,
                private,
                starred,
                timestamp_created
            ) 
        VALUES 
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                0,
                0,
                CURRENT_TIMESTAMP
            )
        `,
      [
        board_id,
        workspace_id,
        title,
        description,
        background_type,
        background_info
      ]
    )

    await updateActivity({
      activity_id,
      activity_type: 'created',
      activity_info: `Board ${title} created`,
      user_id: userId,
      workspace_id
    })
  } catch (error) {
    return Response.json({ error })
  }

  return Response.json({
    workspace_id,
    board_id,
    activity_id,
    background_type,
    background_info,
    description,
    title,
    private: 0,
    starred: 0,
    timestamp_created: new Date().toISOString()
  } as BoardDatabase)
}
