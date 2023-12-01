'use client'

import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useContext, useEffect, useMemo } from 'react'
import { Separator } from '../ui/separator'
import { boardSidebarFeature } from '@/constants/board-sidebar-feature'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import BoardImageOnly from './board-image-only'
import Link from 'next/link'
import CreateNewBoard from './create-new-board'
import { Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function BoardSidebar ({ active_board_id }: { active_board_id: string }) {
  const { user } = useUser()
  const { activeWorkspace } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  return (
    <div className='h-full w-full overflow-y-scroll text-primary-foreground bg-[#00000059] srcollbar scrollbar-y'>
      <div className='p-2 flex items-start gap-2'>
        <Image
          src={user?.imageUrl || ''}
          alt='profile'
          width={40}
          height={40}
          className='rounded'
        />
        <h1 className='font-semibold'>{user?.firstName}'s workspace</h1>
      </div>
      <Separator />
      <div className='my-2 flex flex-col gap-4'>
        {boardSidebarFeature?.map(feature => (
          <div
            key={feature.id}
            className='flex items-center gap-2 p-1 rounded hover:bg-accent-foreground cursor-pointer transition-all'
          >
            {feature.logo}
            <h1 className='font-semibold'>{feature.title}</h1>
          </div>
        ))}
      </div>
      <Separator />
      <div className='my-2 px-2'>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold'>Your boards</h1>
          <CreateNewBoard>
            <Plus className='p-[2px] rounded-sm transition-all hover:bg-accent-foreground cursor-pointer' />
          </CreateNewBoard>
        </div>
        <div className='px-2'>
          {activeWorkspace?.boards
            ?.sort((a, b) => {
              const t1 = new Date(a?.timestamp).getTime()
              const t2 = new Date(b?.timestamp).getTime()

              //sort desc
              return t2 - t1
            })
            .map(board => (
              <Link key={board?.board_id} href={`/b/${board?.board_id}`}>
                <div
                  className={cn(
                    'flex items-center gap-2 my-2 p-1 rounded hover:bg-accent-foreground transition-all cursor-pointer',
                    active_board_id === board?.board_id
                      ? 'bg-accent-foreground'
                      : ''
                  )}
                >
                  <BoardImageOnly
                    board={board}
                    className='h-6 w-8 rounded-sm overflow-hidden'
                  />
                  <h1 className='font-semibold text-sm'>{board?.title}</h1>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export default BoardSidebar
