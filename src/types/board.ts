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

interface Task {
  task_id: string
  title: string
  description: string
  index_order: number
  timestamp_created: string // Consider using appropriate date type
}

export interface List {
  list_id: string
  title: string
  index_order: number
  tasks: Task[]
}

interface Creator {
  user_id: number
  firstname: string
  lastname: string
  email: string
}

export interface BoardFullInfo {
  board_id: number
  title: string
  description: string
  background_type: string
  background_info: string
  private: boolean
  starred: boolean
  timestamp_created: string // Consider using appropriate date type
  creator: Creator
  lists: List[]
}
