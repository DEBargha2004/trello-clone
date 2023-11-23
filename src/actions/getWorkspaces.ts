import { connection } from '../lib/db'

export async function getWorkspaces (user_id: string) {
  const connectionInstance = await connection()
  const workspaces = await connectionInstance.execute(`select * from users;`)
  await connectionInstance.end()
  console.log(workspaces)
}
