import { Board } from './board'

export type WorkSpaceType = {
  workspace_id: string
  title: string
  description?: string
  timestamp?: string
  private: number
  creator?: {
    user_id: string
    firstname: string
    lastname: string
  }
  boards: Board[]
  creator_user_id?: string
}
