import React, { useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import BoardImageWithAuthorName from './board-image-with-author-name'
import { vibrantGradients } from '@/constants/vibrant-gradient'
import { Loader2, MoreHorizontal } from 'lucide-react'
import BoardBackgroundContainer from './board-background-container'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import Kanban from '../../../public/trello-kanban-only.svg'
import { cn } from '@/lib/utils'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardCreationSchema } from '@/schema/board-creation-schema'
import { BoardDatabase } from '@/types/board'
import { cloneDeep } from 'lodash'

function CreateNewBoard ({ children }: { children: React.ReactNode }) {
  const { boardImages, setWorkspaces, activeWorkspace } = useContext(
    global_app_state_context
  ) as GlobalAppStateType
  const [imageIndex, setImageIndex] = useState<number>(0)

  const [background, setBackground] = useState<{
    background_type: 'image' | 'color' | null | ''
    background_info: string | undefined | null
  }>({
    background_type: 'image',
    background_info: ''
  })

  const [boardDialogOpen, setBoardDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(boardCreationSchema)
  })

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
    if (boardImages?.hits?.length) {
      setBackground({
        background_type: 'image',
        background_info: boardImages?.hits[imageIndex]?.largeImageURL
      })
    }
  }, [imageIndex, boardImages])

  return (
    <Dialog
      onOpenChange={open => {
        setImageIndex(Math.floor(Math.random() * 16))
        setBoardDialogOpen(open)
      }}
      open={boardDialogOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='h-full overflow-y-scroll'>
        <div className='flex flex-col items-center gap-1 p-1'>
          <p className='font-medium'>Create board</p>
          <div className='w-full relative aspect-[16/9] overflow-hidden rounded-lg'>
            <Image
              src={Kanban}
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
                src={background.background_info || ''}
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
                  <BoardImageWithAuthorName
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
                            {boardImages?.hits.map((boardImage, index) => (
                              <BoardImageWithAuthorName
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
                            ))}
                          </div>
                        </div>
                      )}
                    >
                      <div className='grid grid-cols-3 gap-2'>
                        {boardImages?.hits
                          .slice(0, 6)
                          .map((boardImage, index) => (
                            <BoardImageWithAuthorName
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
                        {vibrantGradients.slice(0, 6).map((gradient, index) => (
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
              <h1 className='text-sm font-medium my-1'>Board title (*)</h1>
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
  )
}

export default CreateNewBoard
