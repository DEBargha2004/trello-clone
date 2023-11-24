'use server'

import { WorkSpaceType } from '@/types/workspace'
import { db } from '../lib/db'

export async function getWorkspaces (user_id: string) {
  const workspaces = await db.execute(
    `
    SELECT
      JSON_OBJECT(
        'workspace_id', w.workspace_id,
        'title', w.title, 
        'description', w.description, 
        'timestamp', w.timestamp_created, 
        'private', w.private,
        'creator', JSON_OBJECT(
          'user_id', u.user_id,
          'firstname', u.firstname,  
          'lastname', u.lastname
        ),
        'boards',  
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'board_id', b.board_id,   
                'title', b.title,
                'description', b.description,
                'timestamp', b.timestamp_created, 
                'starred', b.starred,
                'background_type', b.background_type,
                'background_info', b.background_info  
              )
            )
            FROM board b
            WHERE b.workspace_id = w.workspace_id  
          )
      ) AS workspace
    FROM workspace_members wm  
    INNER JOIN workspace w ON w.workspace_id = wm.workspace_id
    LEFT JOIN users u ON u.user_id = w.creator_user_id
    WHERE wm.user_id = ?
    GROUP BY w.workspace_id
    ORDER BY w.timestamp_created DESC
    `,
    [user_id]
  )

  console.log('workspaces are', workspaces, Date.now())

  //@ts-ignore
  return workspaces.rows.map(row => row.workspace as WorkSpaceType)

  // return workspaces.rows as WorkSpaceType[]
}
