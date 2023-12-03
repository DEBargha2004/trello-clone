'use client'

import { createNewList } from '@/actions/createNewList'
import { getBoardInfo } from '@/actions/getBoardInfo'
import BoardImageOnly from '@/components/custom/board-image-only'
import ErrorMessage from '@/components/custom/error-message'
import List from '@/components/custom/list'
import ListWrapper from '@/components/custom/list-wrapper'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { board_context } from '@/context/board-context'
import { global_app_state_context } from '@/context/global-app-state-context'
import ListProvider from '@/provider/list-provider'
import { listCreationSchema } from '@/schema/list-creation-schema'
import { BoardFullInfo, List as ListType } from '@/types/board'
import { BoardState } from '@/types/board-state'
import { GlobalAppStateType } from '@/types/global-app-state'
import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { cloneDeep } from 'lodash'
import { Loader2, Plus } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable
} from '@hello-pangea/dnd'
import { rearrangeTasks } from '@/functions/rearrangeTasks'
import { rearrangeColumns } from '@/functions/rearrangeColumns'
import { updateTaskPosition } from '@/actions/updateTask'
import updateActivity from '@/actions/updateActivity'
import { updateListPosition } from '@/actions/updateList'

function Board ({ params }: { params: { boardId: string } }) {
  const boardId = params.boardId
  const { user } = useUser()
  const { boardInfo, setBoardInfo } = useContext(board_context) as BoardState
  const [optimisticBoardInfo, setOptimisticBoardInfo] =
    useState<BoardFullInfo>(boardInfo)

  const { activeWorkspace } = useContext(
    global_app_state_context
  ) as GlobalAppStateType
  const [showListFormDialog, setShowListFormDialog] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(listCreationSchema)
  })

  const handleCreateList = async e => {
    const prev_id = optimisticBoardInfo?.lists?.length
      ? optimisticBoardInfo?.lists?.at(-1)?.list_id
      : null
    const list_id = `list_${crypto.randomUUID()}`
    const optimisticList: ListType = {
      prev_id,
      list_id,
      tasks: [],
      title: e.title
    }
    setOptimisticBoardInfo(prev => {
      prev = cloneDeep(prev)

      if (Array.isArray(prev.lists)) {
        prev.lists.push(optimisticList)
      } else {
        prev.lists = [optimisticList]
      }
      return prev
    })
    try {
      const list = await createNewList(
        e.title,
        boardId,
        prev_id,
        activeWorkspace?.workspace_id,
        list_id
      )

      setBoardInfo(prev => {
        prev = cloneDeep(prev)

        if (Array.isArray(prev.lists)) {
          prev.lists.push(list)
        } else {
          prev.lists = [list]
        }

        return prev
      })
    } catch (error) {
      setOptimisticBoardInfo(boardInfo)
    }

    setShowListFormDialog(false)
  }

  const handleUpdateBoard = (e: DropResult) => {
    if (e.destination?.droppableId === e.source?.droppableId) {
      if (e.source?.droppableId === 'board') {
        setOptimisticBoardInfo(prev => {
          const activeBoard = cloneDeep(prev)
          const activity_id = `activity_${crypto.randomUUID()}`
          if (activeBoard) {
            const source_index = e.source?.index
            const next_to_source_index = e.source?.index + 1
            const destination_index = e.destination!.index
            const next_to_destination_index = e.destination!.index + 1
            const prev_to_destination_index = e.destination!.index - 1
            const next_to_source_item =
              activeBoard?.lists?.[next_to_source_index]
            const source_item = activeBoard?.lists?.[source_index]
            const next_to_destination_item =
              activeBoard?.lists?.[next_to_destination_index]
            const prev_to_destination_item =
              activeBoard?.lists?.[prev_to_destination_index]
            const destination_item = activeBoard?.lists?.[destination_index]

            if (source_index === destination_index) {
              return prev
            }
            if (next_to_source_item) {
              next_to_source_item.prev_id = source_item?.prev_id
              updateListPosition(
                { prev_id: source_item?.prev_id },
                {
                  list_id: next_to_source_item.list_id
                }
              )
            }

            if (source_index > destination_index) {
              source_item.prev_id = prev_to_destination_item?.list_id || null
              updateListPosition(
                { prev_id: prev_to_destination_item?.list_id || null },
                {
                  list_id: source_item.list_id
                }
              )

              destination_item.prev_id = source_item.list_id
              updateListPosition(
                { prev_id: source_item.list_id },
                { list_id: destination_item.list_id }
              )
            } else {
              source_item.prev_id = destination_item.list_id
              updateListPosition(
                {
                  prev_id: destination_item.list_id
                },
                { list_id: source_item.list_id }
              )
              if (next_to_destination_item) {
                next_to_destination_item.prev_id = source_item?.list_id
                updateListPosition(
                  { prev_id: source_item?.list_id },
                  { list_id: next_to_destination_item.list_id }
                )
              }
            }

            updateActivity({
              workspace_id: activeWorkspace!.workspace_id,
              activity_id,
              user_id: user!.id,
              activity_type: 'updated',
              activity_info: `List position changed`
            })
          }

          activeBoard.lists = rearrangeColumns(activeBoard.lists)
          return activeBoard
        })
      } else {
        setOptimisticBoardInfo(prev => {
          prev = cloneDeep(prev)

          const activeList = prev?.lists?.find(
            l => l.list_id === e.source?.droppableId
          )
          if (activeList) {
            const source_index = e.source?.index
            const next_to_source_index = e.source?.index + 1
            const destination_index = e.destination?.index
            const next_to_destination_index = e.destination?.index + 1
            const prev_to_destination_index = e.destination?.index - 1
            const next_to_source_item =
              activeList?.tasks?.[next_to_source_index]
            const source_item = activeList?.tasks?.[source_index]
            const next_to_destination_item =
              activeList?.tasks?.[next_to_destination_index]
            const prev_to_destination_item =
              activeList?.tasks?.[prev_to_destination_index]
            const destination_item = activeList?.tasks?.[destination_index]
            const activity_id = `activity_${crypto.randomUUID()}`
            if (source_index === destination_index) {
              return prev
            }
            if (next_to_source_item) {
              next_to_source_item.prev_id = source_item?.prev_id
              updateTaskPosition(
                {
                  prev_id: source_item.prev_id,
                  list_id: activeList.list_id
                },
                next_to_source_item
              )
            }

            if (source_index > destination_index) {
              source_item.prev_id = prev_to_destination_item?.task_id || null
              updateTaskPosition(
                {
                  prev_id: prev_to_destination_item?.task_id || null,
                  list_id: activeList.list_id
                },
                source_item
              )

              destination_item.prev_id = source_item.task_id
              updateTaskPosition(
                {
                  prev_id: source_item.task_id,
                  list_id: activeList.list_id
                },
                destination_item
              )

              updateActivity({
                workspace_id: activeWorkspace!.workspace_id,
                activity_id,
                user_id: user!.id,
                activity_type: 'updated',
                activity_info: `Task ${source_item.title} updated`
              })
            } else {
              source_item.prev_id = destination_item?.task_id
              updateTaskPosition(
                {
                  prev_id: destination_item?.task_id,
                  list_id: activeList.list_id
                },
                source_item
              )
              if (next_to_destination_item) {
                next_to_destination_item.prev_id = source_item?.task_id
                updateTaskPosition(
                  {
                    prev_id: source_item?.task_id,
                    list_id: activeList.list_id
                  },
                  next_to_destination_item
                )
              }
              updateActivity({
                workspace_id: activeWorkspace!.workspace_id,
                activity_id,
                user_id: user!.id,
                activity_type: 'updated',
                activity_info: `Task ${source_item.title} updated`
              })
            }
          }

          prev.lists = rearrangeTasks(prev.lists)
          return prev
        })
      }
    } else {
      setOptimisticBoardInfo(prev => {
        prev = cloneDeep(prev)

        const sourceList = prev?.lists?.find(
          l => l.list_id === e.source?.droppableId
        )
        const destinationList = prev?.lists?.find(
          l => l.list_id === e.destination?.droppableId
        )
        if (sourceList && destinationList) {
          const sourceIndex = e.source?.index
          const destinationIndex = e.destination!.index
          const next_to_source_index = e.source?.index + 1
          //@ts-ignore
          const prev_to_destination_index = e.destination?.index - 1
          const source_item = sourceList?.tasks?.[sourceIndex]
          const next_to_source_item = sourceList?.tasks?.[next_to_source_index]
          const prev_to_destination_item =
            destinationList?.tasks?.[prev_to_destination_index]
          const destination_item = destinationList?.tasks?.[destinationIndex]
          const activity_id = `activity_${crypto.randomUUID()}`

          if (next_to_source_item) {
            next_to_source_item.prev_id = source_item?.prev_id
            updateTaskPosition(
              {
                prev_id: source_item.prev_id,
                list_id: sourceList.list_id
              },
              next_to_source_item
            )
          }

          const spliced_source_item = sourceList?.tasks?.splice(
            sourceIndex,
            1
          )[0]

          if (Array.isArray(destinationList.tasks)) {
            destinationList.tasks.push(spliced_source_item)
          } else {
            destinationList.tasks = [spliced_source_item]
          }
          source_item.prev_id = prev_to_destination_item?.task_id || null
          updateTaskPosition(
            {
              list_id: destinationList.list_id,
              prev_id: prev_to_destination_item?.task_id || null
            },
            source_item
          )

          if (destination_item) {
            destination_item.prev_id = source_item?.task_id
            updateTaskPosition(
              {
                prev_id: source_item?.task_id,
                list_id: destinationList.list_id
              },
              destination_item
            )
            updateActivity({
              workspace_id: activeWorkspace!.workspace_id,
              activity_id,
              user_id: user!.id,
              activity_type: 'updated',
              activity_info: `Task ${source_item.title} updated`
            })
          }
        }

        prev.lists = rearrangeTasks(prev.lists)
        return prev
      })
    }

    // setOptimisticBoardInfo(prev => {
    //   prev = cloneDeep(prev)
    //   if (e.destination?.droppableId === e.source?.droppableId) {
    //     const activeList = prev?.lists?.find(
    //       l => l.list_id === e.source?.droppableId
    //     )
    //     if (activeList) {
    //       const source_index = e.source?.index
    //       const next_to_source_index = e.source?.index + 1
    //       const destination_index = e.destination?.index
    //       const next_to_destination_index = e.destination?.index + 1
    //       const prev_to_destination_index = e.destination?.index - 1
    //       const next_to_source_item = activeList?.tasks?.[next_to_source_index]
    //       const source_item = activeList?.tasks?.[source_index]
    //       const next_to_destination_item =
    //         activeList?.tasks?.[next_to_destination_index]
    //       const prev_to_destination_item =
    //         activeList?.tasks?.[prev_to_destination_index]
    //       const destination_item = activeList?.tasks?.[destination_index]

    //       if (source_index === destination_index) {
    //         return prev
    //       }
    //       if (next_to_source_item) {
    //         next_to_source_item.prev_id = source_item?.prev_id
    //       }

    //       if (source_index > destination_index) {
    //         source_item.prev_id = prev_to_destination_item?.task_id || null

    //         destination_item.prev_id = source_item.task_id
    //       } else {
    //         source_item.prev_id = destination_item?.task_id
    //         if (next_to_destination_item) {
    //           next_to_destination_item.prev_id = source_item?.task_id
    //         }
    //       }
    //     }
    //   } else {
    //     const sourceList = prev?.lists?.find(
    //       l => l.list_id === e.source?.droppableId
    //     )
    //     const destinationList = prev?.lists?.find(
    //       l => l.list_id === e.destination?.droppableId
    //     )
    //     if (sourceList && destinationList) {
    //       const sourceIndex = e.source?.index
    //       const destinationIndex = e.destination?.index
    //       const next_to_source_index = e.source?.index + 1
    //       //@ts-ignore
    //       const prev_to_destination_index = e.destination?.index - 1
    //       const source_item = sourceList?.tasks?.[sourceIndex]
    //       const next_to_source_item = sourceList?.tasks?.[next_to_source_index]
    //       const prev_to_destination_item =
    //         destinationList?.tasks?.[prev_to_destination_index]
    //       const destination_item = destinationList?.tasks?.[destinationIndex]

    //       if (next_to_source_item) {
    //         next_to_source_item.prev_id = source_item?.prev_id
    //       }

    //       const spliced_source_item = sourceList?.tasks?.splice(
    //         sourceIndex,
    //         1
    //       )[0]

    //       if (Array.isArray(destinationList.tasks)) {
    //         destinationList.tasks.push(spliced_source_item)
    //       } else {
    //         destinationList.tasks = [spliced_source_item]
    //       }
    //       source_item.prev_id = prev_to_destination_item?.task_id || null

    //       if (destination_item) {
    //         destination_item.prev_id = source_item?.task_id
    //       }
    //     }
    //   }

    //   prev.lists = rearrangeTasks(prev.lists)
    //   return prev
    // })
  }

  useEffect(() => {
    if (!user?.id) return

    getBoardInfo(boardId).then((data: BoardFullInfo) => {
      data.lists = rearrangeColumns(data.lists)
      data.lists = rearrangeTasks(data.lists)
      setBoardInfo(data)
    })
  }, [user])

  useEffect(() => {
    setOptimisticBoardInfo(boardInfo)
  }, [boardInfo])

  console.log('re-render')

  return (
    <div className='h-full'>
      <div
        className='relative h-full overflow-x-scroll scrollbar scrollbar-x'
        onWheel={e => (e.currentTarget.scrollLeft += e.deltaY)}
      >
        <div className='p-5 px-7 bg-[#00000041] mb-4 sticky left-0 blurry-background'>
          <h1 className='text-white font-semibold'>
            {optimisticBoardInfo?.title}
          </h1>
        </div>
        <DragDropContext onDragEnd={handleUpdateBoard}>
          <div className='flex justify-start items-start gap-0 px-3'>
            <Droppable droppableId='board' direction='horizontal' type='column'>
              {boardDroppableProvided => (
                <div
                  {...boardDroppableProvided.droppableProps}
                  ref={boardDroppableProvided.innerRef}
                  className='flex'
                >
                  {optimisticBoardInfo?.lists?.map((list, l_index) => (
                    <Draggable
                      key={list.list_id}
                      draggableId={list.list_id}
                      index={l_index}
                    >
                      {boardDraggableProvided => (
                        <div
                          {...boardDraggableProvided.draggableProps}
                          ref={boardDraggableProvided.innerRef}
                        >
                          <ListWrapper
                            key={list?.list_id}
                            className='shrink-0 mr-4'
                          >
                            <ListProvider>
                              <List
                                title={list.title}
                                list={list}
                                draggableProps={boardDraggableProvided}
                              />
                            </ListProvider>
                          </ListWrapper>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {boardDroppableProvided.placeholder}
                </div>
              )}
            </Droppable>
            <ListWrapper className='shrink-0'>
              <Dialog
                open={showListFormDialog}
                onOpenChange={setShowListFormDialog}
              >
                <DialogTrigger className='w-full'>
                  <div className='flex p-3 gap-3 items-center bg-[#ffffff54] transition-all hover:bg-[#ffffff2f] rounded-xl cursor-pointer'>
                    <Plus className='h-4 text-white' />
                    <p className='text-white font-semibold'>Add a List</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>Create New List</DialogHeader>
                  <form onSubmit={handleSubmit(handleCreateList)}>
                    <h1 className='font-semibold my-1'>Title</h1>
                    <Input {...register('title')} />
                    <ErrorMessage>
                      {errors?.title?.message?.toString()}
                    </ErrorMessage>

                    <Button className='mt-5' disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className='animate-spin mr-2' />
                      ) : null}
                      Create
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </ListWrapper>
          </div>
        </DragDropContext>
      </div>
      <div>
        <div className='h-full absolute top-0 right-0 w-screen -z-10'>
          <BoardImageOnly
            board={optimisticBoardInfo}
            className='bg-[#000000f5]'
            imageClassName='opacity-70'
          />
        </div>
      </div>
    </div>
  )
}

export default Board
