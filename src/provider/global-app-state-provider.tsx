'use client'

import { global_app_state_context as GlobalAppStateContext } from '@/context/global-app-state-context'
import { ReactNode } from 'react'

const GlobalAppStateProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GlobalAppStateContext.Provider value={{}}>
      {children}
    </GlobalAppStateContext.Provider>
  )
}

export default GlobalAppStateProvider
