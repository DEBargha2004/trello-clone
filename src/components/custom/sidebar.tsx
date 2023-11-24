'use client'

import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { useContext, useMemo, useState } from 'react'
import Workspace from './workspace-accordion'
import { Accordion } from '../ui/accordion'
import { Loader2, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { createWorkspace } from '@/actions/createWorkspace'
import { WorkSpaceType } from '@/types/workspace'

export function Sidebar () {
  const { workspaces, setWorkspaces, activeWorkspace } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const [workspaceDialogState, setWorkspaceDialogState] =
    useState<boolean>(false)
  const [workspaceInfo, setWorkspaceInfo] = useState<{
    title: string
    loading: boolean
    description?: string
  }>({
    title: '',
    loading: false,
    description: ''
  })

  async function handleWorkspaceCreation () {
    setWorkspaceInfo(prev => ({ ...prev, loading: true }))

    const workspace: WorkSpaceType[] = await createWorkspace(
      workspaceInfo.title,
      workspaceInfo.description
    )

    setWorkspaces(prev => [...workspace, ...prev])

    setWorkspaceInfo(prev => ({
      ...prev,
      loading: false,
      description: '',
      title: ''
    }))
    setWorkspaceDialogState(false)
  }

  //   console.log(workspaces[0].title)

  return (
    <div className='w-full h-full flex flex-col justify-start items-end p-3'>
      <div className='w-full flex justify-between py-1'>
        <p>Create New</p>
        <Dialog
          open={workspaceDialogState}
          onOpenChange={e => setWorkspaceDialogState(e)}
        >
          <DialogTrigger>
            <Plus className='h-6 p-1 rounded hover:bg-cyan-100 transition-all cursor-pointer' />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
            </DialogHeader>
            <Input
              value={workspaceInfo.title}
              onChange={e =>
                setWorkspaceInfo(prev => ({ ...prev, title: e.target.value }))
              }
            />
            <Textarea
              value={workspaceInfo.description}
              onChange={e =>
                setWorkspaceInfo(prev => ({
                  ...prev,
                  description: e.target.value
                }))
              }
            />
            <DialogFooter>
              <Button onClick={handleWorkspaceCreation}>
                {workspaceInfo.loading ? (
                  <Loader2 className='h-5 animate-spin mr-2' />
                ) : null}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Accordion
        type='single'
        collapsible
        value={activeWorkspace?.workspace_id}
        className='w-full'
      >
        {workspaces.map(workspace => (
          <Workspace
            key={workspace.workspace_id}
            workspace_id={workspace.workspace_id}
          >
            {workspace.title}
          </Workspace>
        ))}
      </Accordion>
    </div>
  )
}
