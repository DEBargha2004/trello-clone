'use client'

import getImages from '@/actions/getImages'
import Board from '@/components/custom/Board'
import BoardImage from '@/components/custom/board-image'
import WorkspaceBoardsListWrapper from '@/components/custom/workspace-boards-list-wrapper'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { ImageApiData } from '@/types/image-api'
import { useUser } from '@clerk/nextjs'
import { LockKeyhole, MoreHorizontal, UnlockKeyhole, User2 } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import Kanbar from '../../../../../../public/trello-kanban-only.svg'
import { cn } from '@/lib/utils'

function Page () {
  const { user } = useUser()
  const { userInfo, activeWorkspace, workspaces } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const [boardImages, setBoardImages] = useState<
    ImageApiData | null | undefined
  >()

  const vibrantGradients: string[] = [
    'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500',
    'bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500',
    'bg-gradient-to-tr from-blue-400 via-purple-500 to-indigo-500',
    'bg-gradient-to-tr from-green-400 via-teal-500 to-blue-500',
    'bg-gradient-to-tr from-yellow-400 via-green-500 to-blue-500',
    'bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500',
    'bg-gradient-to-tr from-red-400 via-orange-500 to-yellow-500',
    'bg-gradient-to-tr from-orange-400 via-red-500 to-pink-500'
  ]
  const [imageIndex, setImageIndex] = useState<number>(0)

  const [background, setBackground] = useState<{
    background_type: 'image' | 'color' | null | ''
    background_info: string | undefined | null
  }>({
    background_type: 'image',
    background_info: ''
  })

  const starredBoards = useMemo(() => {
    if (!activeWorkspace?.workspace_id) return
    return activeWorkspace.boards?.filter(board => board.starred)
  }, [activeWorkspace])

  useEffect(() => {
    getImages().then(res => {
      //@ts-ignore
      setBoardImages(res)
    })
  }, [])

  useEffect(() => {
    if (boardImages?.hits?.length) {
      setBackground({
        background_type: 'image',
        background_info: boardImages?.hits[imageIndex]?.largeImageURL
      })
    }
  }, [imageIndex, boardImages])

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
                <Board board={starredBoard} key={index} />
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
            {activeWorkspace?.boards?.map((starredBoard, index) => (
              <Board board={starredBoard} key={index} />
            ))}
            <Dialog
              onOpenChange={open =>
                setImageIndex(Math.floor(Math.random() * 16))
              }
            >
              <DialogTrigger asChild>
                <div className='w-full aspect-[16/9]  transition-all rounded-md bg-slate-200 hover:bg-slate-300 overflow-hidden flex justify-center items-center cursor-pointer'>
                  Create new board
                </div>
              </DialogTrigger>
              <DialogContent>
                <div className=' flex flex-col items-center gap-1 p-1'>
                  <p className='font-medium'>Create board</p>
                  <div className='w-full relative aspect-[16/9] overflow-hidden rounded-lg'>
                    <Image
                      src={Kanbar}
                      alt='kanban'
                      width={400}
                      className='absolute top-0 left-1/2 z-10 w-4/5 -translate-x-1/2'
                    />
                    {background.background_type === 'color' ? (
                      <div
                        className={cn(
                          'absolute top-0 left-0 w-full h-full',
                          background.background_info
                        )}
                      />
                    ) : (
                      <Image
                        src={background.background_info}
                        alt='background-image'
                        width={400}
                        height={400}
                        className='absolute top-0 left-0 w-full'
                      />
                    )}
                  </div>
                  <div className='w-full'>
                    <p className='text-sm font-medium my-1'>Background</p>
                    <div className='grid grid-cols-4 gap-2'>
                      {boardImages?.hits
                        ?.slice(imageIndex, imageIndex + 4)
                        ?.map(boardImage => (
                          <BoardImage
                            boardImage={boardImage}
                            key={boardImage.id}
                            handleSelectBackground={id => {
                              const url = boardImages?.hits?.find(
                                hit => hit.id === id
                              )?.largeImageURL
                              setBackground({
                                background_type: 'image',
                                background_info: url
                              })
                            }}
                          />
                        ))}
                    </div>
                    <div className='grid grid-cols-6 gap-2 my-2'>
                      {vibrantGradients.slice(0, 5).map((gradient, index) => (
                        <div
                          key={index}
                          className={`w-full aspect-[4/3] cursor-pointer rounded ${gradient}`}
                          onClick={() => {
                            setBackground({
                              background_type: 'color',
                              background_info: gradient
                            })
                          }}
                        ></div>
                      ))}
                      <div className='w-full aspect-[4/3] cursor-pointer rounded bg-slate-300 flex justify-center items-center'>
                        <MoreHorizontal className='h-5' />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </WorkspaceBoardsListWrapper>
      </div>
    </section>
  )
}

export default Page
