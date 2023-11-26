'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

/**
 * Updates the star value of a board in the database.
 *
 * @param {number} star - The new star value for the board.
 * @param {string} board_id - The ID of the board to update.
 * @return {number} The updated star value.
 */
export default async function updateBoardStar (star: number, board_id: string) {
  console.log(star, board_id)

  const user = await currentUser()
  if (!board_id || !user?.id) {
    return Math.abs(star - 1)
  }

  await db.execute(
    `
  update board 
  set starred = ?
  where board_id = ?
    `,
    [star, board_id]
  )
  return star
}
