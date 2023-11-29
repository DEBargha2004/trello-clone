'use client'

import { ReactNode, useContext, useEffect } from 'react'

import includeUser from './actions/includeUser'
import { useUser } from '@clerk/nextjs'
import { GlobalAppStateType } from './types/global-app-state'
import { global_app_state_context } from './context/global-app-state-context'
import { UserData } from './types/user'
import { getWorkspaces } from './actions/getWorkspaces'
import getImages from './actions/getImages'

function App ({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const { setUserInfo, setWorkspaces, setBoardImages } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  useEffect(() => {
    if (!user?.id) return
    //@ts-ignore
    includeUser().then((userData: UserData) => {
      if (userData?.user_id) {
        setUserInfo(userData)
      }
    })

    getWorkspaces(user.id).then(workspaces => {
      setWorkspaces(workspaces)
    })
  }, [user])

  useEffect(() => {
    getImages().then(res => {
      //@ts-ignore
      setBoardImages(res)
    })
  }, [])

  return <>{children}</>
}

export default App
