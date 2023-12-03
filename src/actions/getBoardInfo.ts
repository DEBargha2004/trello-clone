'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

export async function getBoardInfo (board_id: string) {
  const { userId } = auth()

  if (!userId) return {}

  const board = await db.execute(
    `
        SELECT
            JSON_OBJECT(
                'board_id', b.board_id,
                'title', b.title,
                'description', b.description,
                'background_type', b.background_type,
                'background_info', b.background_info,
                'private', b.private,
                'starred', b.starred,
                'timestamp_created', b.timestamp_created,
                'creator', JSON_OBJECT(
                    'user_id', u.user_id,
                    'firstname', u.firstname,
                    'lastname', u.lastname,
                    'email', u.email
                ),
                'lists', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'list_id', l.list_id,
                            'title', l.title,
                            'prev_id', l.prev_id,
                            'tasks', (
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'task_id', t.task_id,
                                        'title', t.title,
                                        'description', t.description,
                                        'prev_id', t.prev_id,
                                        'timestamp_created', t.timestamp_created
                                    )
                                )
                                FROM task t
                                WHERE t.list_id = l.list_id
                            )
                        )
                    )
                    FROM list l
                    WHERE l.board_id = ?
                )
        ) AS board_data
        FROM
            board b
        JOIN
            workspace w ON b.workspace_id = w.workspace_id
        JOIN
            users u ON w.creator_user_id = u.user_id
        WHERE
            b.board_id = ?
        ;
    `,
    [board_id, board_id]
  )

  return board.rows[0].board_data
}
