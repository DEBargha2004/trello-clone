'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import AppLogo from './app-logo'
import { Separator } from '@radix-ui/react-separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { useContext } from 'react'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function Navbar () {
  const { isSignedIn } = useUser()
  const { workspaces, activeWorkspace } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const router = useRouter()

  return isSignedIn ? (
    <div className='h-full flex flex-col justify-between'>
      <div className='flex justify-between items-center p-2'>
        <div className='flex justify-between items-center gap-2'>
          <AppLogo />
        </div>
        <div className='flex justify-between items-start gap-2'>
          <Select
            // defaultValue={activeWorkspace?.workspace_id}
            value={activeWorkspace?.workspace_id}
            onValueChange={e => {
              router.push(`/w/${e}/boards`)
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Your Workspaces' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Workspaces</SelectLabel>
                {workspaces.map(workspace => (
                  <SelectItem
                    key={workspace.workspace_id}
                    value={workspace.workspace_id}
                  >
                    {workspace.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <UserButton />
        </div>
      </div>
      <Separator
        className='h-[1px] bg-slate-300 my-1'
        orientation='horizontal'
      />
    </div>
  ) : null
}

export default Navbar
