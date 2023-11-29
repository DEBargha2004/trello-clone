'use client'

import Board from '@/components/custom/Board'
import WorkspaceBoardsListWrapper from '@/components/custom/workspace-boards-list-wrapper'
import { Separator } from '@/components/ui/separator'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { useUser } from '@clerk/nextjs'
import { LockKeyhole, UnlockKeyhole, User2 } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useMemo } from 'react'

import CustomLink from '@/components/custom/custom-link'
import CreateNewBoard from '@/components/custom/create-new-board'

function Page () {
  const { user } = useUser()
  const { userInfo, activeWorkspace, setWorkspaces } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const starredBoards = useMemo(() => {
    if (!activeWorkspace?.workspace_id) return
    console.log(activeWorkspace.boards?.filter(board => board.starred))

    return activeWorkspace.boards?.filter(board => board.starred)
  }, [activeWorkspace])

  return (
    <section className='px-5'>
      <div className='flex gap-2 items-center'>
        <Image
          src={user?.imageUrl || ''}
          width={70}
          height={70}
          alt='profile'
          className='rounded'
        />
        <div>
          <h1 className='font-semibold text-lg'>
            {userInfo?.firstname}'s workspace
          </h1>
          <div className='flex items-center text-sm text-slate-500'>
            {activeWorkspace?.private ? (
              <>
                <LockKeyhole className='h-4' />
                <p>Private</p>
              </>
            ) : (
              <>
                <UnlockKeyhole className='h-4' />
                <p>Public</p>
              </>
            )}
          </div>
        </div>
      </div>
      <Separator className='my-4 h-[2px]' />
      <div>
        {starredBoards?.length ? (
          <WorkspaceBoardsListWrapper>
            <div className='flex items-center gap-2 px-2'>
              <User2 className='h-5' />
              <h1 className='font-semibold'>Starred boards</h1>
            </div>
            <div className='grid grid-cols-4 gap-2 my-3'>
              {starredBoards?.map((starredBoard, index) => (
                <CustomLink
                  key={starredBoard?.board_id}
                  href={`/b/${starredBoard?.board_id}`}
                >
                  <Board
                    board={starredBoard}
                    key={`${starredBoard?.board_id}-${starredBoard.starred}`}
                  />
                </CustomLink>
              ))}
            </div>
          </WorkspaceBoardsListWrapper>
        ) : null}

        <WorkspaceBoardsListWrapper>
          <div className='flex items-center gap-2 px-2'>
            <User2 className='h-5' />
            <h1 className='font-semibold'>Your boards</h1>
          </div>
          <div className='grid grid-cols-4 gap-2 my-3'>
            {activeWorkspace?.boards?.map((board, index) => (
              <CustomLink href={`/b/${board?.board_id}`} key={board?.board_id}>
                <Board
                  board={board}
                  key={`${board?.board_id}-${board.starred}`}
                />
              </CustomLink>
            ))}
            <CreateNewBoard>
              <div className='w-full aspect-[16/9]  transition-all rounded-md bg-slate-200 hover:bg-slate-300 overflow-hidden flex justify-center items-center cursor-pointer'>
                Create new board
              </div>
            </CreateNewBoard>
          </div>
        </WorkspaceBoardsListWrapper>
      </div>
    </section>
  )
}

export default Page
