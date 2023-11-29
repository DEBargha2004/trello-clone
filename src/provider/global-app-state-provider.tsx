'use client'

import { global_app_state_context as GlobalAppStateContext } from '@/context/global-app-state-context'
import { ActiveWorkspaceFeature } from '@/types/global-app-state'
import { ImageApiData } from '@/types/image-api'
import { UserData } from '@/types/user'
import { WorkSpaceType } from '@/types/workspace'
import { ReactNode, useMemo, useState } from 'react'

const GlobalAppStateProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserData>({
    user_id: '',
    firstname: '',
    lastname: '',
    email: ''
  })
  const [workspaces, setWorkspaces] = useState<WorkSpaceType[]>([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<
    string | null | undefined
  >()
  const [activeWorkspaceFeature, setActiveWorkspaceFeature] =
    useState<ActiveWorkspaceFeature>(null)

  const [boardImages, setBoardImages] = useState<
    ImageApiData | null | undefined
  >()

  const activeWorkspace = useMemo(() => {
    if (!activeWorkspaceId) return

    // console.log('change deteceted')

    return workspaces.find(
      workspace => workspace.workspace_id === activeWorkspaceId
    )
  }, [activeWorkspaceId, workspaces])
  return (
    <GlobalAppStateContext.Provider
      value={{
        userInfo,
        setUserInfo,
        workspaces,
        setWorkspaces,
        activeWorkspace,
        setActiveWorkspaceId,
        activeWorkspaceFeature,
        setActiveWorkspaceFeature,
        boardImages,
        setBoardImages
      }}
    >
      {children}
    </GlobalAppStateContext.Provider>
  )
}

export default GlobalAppStateProvider
