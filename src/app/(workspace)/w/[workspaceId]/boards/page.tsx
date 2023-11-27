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
import {
  Loader2,
  LockKeyhole,
  MoreHorizontal,
  UnlockKeyhole,
  User2
} from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vibrantGradients } from '@/constants/vibrant-gradient'
import Kanbar from '../../../../../../public/trello-kanban-only.svg'
import { cn } from '@/lib/utils'
import { boardCreationSchema } from '@/schema/board-creation-schema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import BoardBackgroundContainer from '@/components/custom/board-background-container'
import { BoardDatabase } from '@/types/board'
import { Textarea } from '@/components/ui/textarea'

import { cloneDeep } from 'lodash'
import Link from 'next/link'
import CustomLink from '@/components/custom/custom-link'

function Page () {
  const { user } = useUser()
  const { userInfo, activeWorkspace, setWorkspaces } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(boardCreationSchema)
  })

  const [boardImages, setBoardImages] = useState<
    ImageApiData | null | undefined
  >()

  const [imageIndex, setImageIndex] = useState<number>(0)

  const [background, setBackground] = useState<{
    background_type: 'image' | 'color' | null | ''
    background_info: string | undefined | null
  }>({
    background_type: 'image',
    background_info: ''
  })

  const [boardDialogOpen, setBoardDialogOpen] = useState(false)

  const starredBoards = useMemo(() => {
    if (!activeWorkspace?.workspace_id) return
    console.log(activeWorkspace.boards?.filter(board => board.starred))

    return activeWorkspace.boards?.filter(board => board.starred)
  }, [activeWorkspace])

  async function handleBoardCreation (e: FieldValues) {
    // console.log(e)

    let response = await fetch(`/api/createBoard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: e.title,
        description: e.description,
        background_type: background.background_type,
        background_info: background.background_info,
        workspace_id: activeWorkspace?.workspace_id
      } as BoardDatabase)
    })
    response = await response.json()

    setWorkspaces(prev => {
      prev = cloneDeep(prev)

      const currentWorkspace = prev.find(
        workspace => workspace.workspace_id === activeWorkspace?.workspace_id
      )

      const board = {
        workspace_id: response.workspace_id,
        board_id: response.board_id,
        title: response.title,
        description: response.description,
        background_type: response.background_type,
        background_info: response.background_info,
        starred: response.starred,
        timestamp: response.timestamp
      } as BoardDatabase

      if (Array.isArray(currentWorkspace?.boards)) {
        currentWorkspace?.boards.unshift(board)
      } else {
        currentWorkspace.boards = [board]
      }

      return prev
    })

    setBoardDialogOpen(false)
  }

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
            <Dialog
              onOpenChange={open => {
                setImageIndex(Math.floor(Math.random() * 16))
                setBoardDialogOpen(open)
              }}
              open={boardDialogOpen}
            >
              <DialogTrigger asChild>
                <div className='w-full aspect-[16/9]  transition-all rounded-md bg-slate-200 hover:bg-slate-300 overflow-hidden flex justify-center items-center cursor-pointer'>
                  Create new board
                </div>
              </DialogTrigger>
              <DialogContent className='h-full overflow-y-scroll'>
                <div className='flex flex-col items-center gap-1 p-1'>
                  <p className='font-medium'>Create board</p>
                  <div className='w-full relative aspect-[16/9] overflow-hidden rounded-lg'>
                    <Image
                      src={Kanbar}
                      alt='kanban'
                      width={400}
                      className='absolute top-2 left-1/2 z-10 w-4/5 -translate-x-1/2'
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

                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='w-full aspect-[4/3] cursor-pointer rounded bg-slate-300 flex justify-center items-center'>
                            <MoreHorizontal className='h-5' />
                          </div>
                        </DialogTrigger>
                        <DialogContent className=''>
                          <div className='p-2 min-w-[400px]'>
                            <h1 className='text-center font-semibold'>
                              Board background
                            </h1>
                            <BoardBackgroundContainer
                              heading='Photos'
                              collection={() => (
                                <div className='h-[300px] overflow-y-scroll'>
                                  <div className='grid grid-cols-3 gap-2 min-w-[350px] p-2 h-fit overflow-y-scroll'>
                                    {boardImages?.hits.map(
                                      (boardImage, index) => (
                                        <BoardImage
                                          boardImage={boardImage}
                                          key={boardImage.id}
                                          className=''
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
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            >
                              <div className='grid grid-cols-3 gap-2'>
                                {boardImages?.hits
                                  .slice(0, 6)
                                  .map((boardImage, index) => (
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
                            </BoardBackgroundContainer>
                            <BoardBackgroundContainer
                              heading='Colors'
                              collection={() => (
                                <div className='h-[300px] overflow-y-scroll'>
                                  <div className='grid grid-cols-3 gap-2 min-w-[350px] p-2 h-fit overflow-y-scroll'>
                                    {vibrantGradients
                                      .slice(0, 20)
                                      .map((gradient, index) => (
                                        <div
                                          key={index}
                                          className={`w-full aspect-[16/9] cursor-pointer rounded ${gradient}`}
                                          onClick={() => {
                                            setBackground({
                                              background_type: 'color',
                                              background_info: gradient
                                            })
                                          }}
                                        ></div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            >
                              <div className='grid grid-cols-3 gap-2'>
                                {vibrantGradients
                                  .slice(0, 6)
                                  .map((gradient, index) => (
                                    <div
                                      key={index}
                                      className={`w-full aspect-[16/9] cursor-pointer rounded ${gradient}`}
                                      onClick={() => {
                                        setBackground({
                                          background_type: 'color',
                                          background_info: gradient
                                        })
                                      }}
                                    ></div>
                                  ))}
                              </div>
                            </BoardBackgroundContainer>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <form
                      onSubmit={handleSubmit(e => handleBoardCreation(e))}
                      className='mt-4'
                    >
                      <h1 className='text-sm font-medium my-1'>
                        Board title (*)
                      </h1>
                      <Input
                        type='text'
                        placeholder='Enter board name'
                        {...register('title')}
                      />
                      <p className='text-sm font-medium my-1 text-red-500'>
                        {errors?.title?.message?.toString() || ''}
                      </p>
                      <h1 className='text-sm font-medium my-1'>
                        Description <i>(optional)</i>
                      </h1>
                      <Textarea
                        placeholder='Enter board name'
                        {...register('description')}
                      />
                      <p className='text-sm font-medium my-1 text-red-500'>
                        {errors?.title?.message?.toString() || ''}
                      </p>
                      <Button className='mt-4' disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className='animate-spin mr-2' />
                        ) : null}
                        Create
                      </Button>
                    </form>
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
