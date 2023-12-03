'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export async function updateListPosition (
  { prev_id }: { prev_id: string | null },
  { list_id }: { list_id: string }
) {
  const user = await currentUser()
  if (!user?.id) return

  await db.execute(`UPDATE list SET prev_id = ? WHERE list_id = ?`, [
    prev_id,
    list_id
  ])
}
