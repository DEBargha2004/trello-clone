'use client'

import { global_app_state_context as GlobalAppStateContext } from '@/context/global-app-state-context'
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
  return (
    <GlobalAppStateContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </GlobalAppStateContext.Provider>
  )
}

export default GlobalAppStateProvider
