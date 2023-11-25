'use client'

import { Sidebar } from '@/components/custom/sidebar'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { usePathname } from 'next/navigation'
import { ReactNode, useContext, useEffect } from 'react'

export default function Layout ({ children }: { children: ReactNode }) {
  const { setActiveWorkspaceFeature, setActiveWorkspaceId, workspaces } =
    useContext(global_app_state_context) as GlobalAppStateType
  const pathName = usePathname()

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

    console.log(pathName.split(`/`))
  }, [pathName, workspaces])
  return (
    <div className='flex justify-between items-start h-full px-10 py-5'>
      <div className='w-1/4 h-full pl-5'>
        <Sidebar />
      </div>
      <div className='w-3/4 h-full '>{children}</div>
    </div>
  )
}
