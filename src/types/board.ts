export type Board = {
  board_id: string
  title: string
  description?: string
  timestamp?: string
  starred: number
  background_type: 'color' | 'image'
  background_info: string
  workspace_id?: string
}

export interface BoardDatabase {
  board_id?: string
  workspace_id: string
  title: string
  description: string
  timestamp_created?: string
  starred?: number
  private?: number
  background_type: string
  background_info: string
}
