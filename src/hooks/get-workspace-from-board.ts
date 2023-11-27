'use client'

import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { WorkSpaceType } from '@/types/workspace'
import { useContext } from 'react'

export const useWorkspaceInfo = () => {
  const { workspaces } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const getActiveWorkspaceFromBoardId = (boardId: string): WorkSpaceType => {
    const activeWorkspace = workspaces.find(workspace => {
      return workspace?.boards?.find(board => {
        return board?.board_id === boardId
      })
    })

    return activeWorkspace
  }

  return {
    getActiveWorkspaceFromBoardId
  }
}
