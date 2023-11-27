'use client'

import { global_app_state_context } from '@/context/global-app-state-context'
import { useWorkspaceInfo } from '@/hooks/get-workspace-from-board'
import { GlobalAppStateType } from '@/types/global-app-state'
import { usePathname } from 'next/navigation'
import { useContext, useEffect } from 'react'

function WorkspaceControl () {
  const { setActiveWorkspaceFeature, setActiveWorkspaceId, workspaces } =
    useContext(global_app_state_context) as GlobalAppStateType
  const pathName = usePathname()
  const { getActiveWorkspaceFromBoardId } = useWorkspaceInfo()

  function handlePathChange (path: string) {
    const pathArr = path.split(`/`)
    if (pathArr[1] === 'w' && pathArr[2].indexOf('workspace_') === 0) {
      const workspaceId = pathArr[2]
      const workspace = workspaces.find(
        workspace => workspace.workspace_id === workspaceId
      )
      if (workspace) {
        setActiveWorkspaceId(workspace?.workspace_id)
      }
    } else if (pathArr[1] === 'b' && pathArr[2].indexOf('board_') === 0) {
      const activeWorkspace = getActiveWorkspaceFromBoardId(pathArr[2])
      console.log('in boards', activeWorkspace)

      setActiveWorkspaceId(activeWorkspace?.workspace_id)
    }
    if (
      pathArr[1] === 'w' &&
      pathArr[2].indexOf('workspace_') === 0 &&
      pathArr[3]
    ) {
      setActiveWorkspaceFeature(pathArr[3])
    }
  }

  useEffect(() => {
    if (!pathName) return

    handlePathChange(pathName)

    // console.log(pathName.split(`/`))
  }, [pathName, workspaces])
  return null
}

export default WorkspaceControl
