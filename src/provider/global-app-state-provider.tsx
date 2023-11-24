'use client'

import { global_app_state_context as GlobalAppStateContext } from '@/context/global-app-state-context'
import { ActiveWorkspaceFeature } from '@/types/global-app-state'
import { UserData } from '@/types/user'
import { WorkSpaceType } from '@/types/workspace'
import { ReactNode, useState } from 'react'

const GlobalAppStateProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserData>({
    user_id: '',
    firstname: '',
    lastname: '',
    email: ''
  })
  const [workspaces, setWorkspaces] = useState<WorkSpaceType[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<WorkSpaceType>()
  const [activeWorkspaceFeature, setActiveWorkspaceFeature] =
    useState<ActiveWorkspaceFeature>(null)
  return (
    <GlobalAppStateContext.Provider
      value={{
        userInfo,
        setUserInfo,
        workspaces,
        setWorkspaces,
        activeWorkspace,
        setActiveWorkspace,
        activeWorkspaceFeature,
        setActiveWorkspaceFeature
      }}
    >
      {children}
    </GlobalAppStateContext.Provider>
  )
}

export default GlobalAppStateProvider
