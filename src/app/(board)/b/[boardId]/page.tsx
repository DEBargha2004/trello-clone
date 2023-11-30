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
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { board_context } from '@/context/board-context'
import { global_app_state_context } from '@/context/global-app-state-context'
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
    const index_order = optimisticBoardInfo?.lists?.length
      ? optimisticBoardInfo?.lists?.length - 1
      : 0
    const optimisticList: ListType = {
      index_order,
      list_id: `list_${crypto.randomUUID()}`,
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
        index_order,
        activeWorkspace?.workspace_id
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

  useEffect(() => {
    if (!user?.id) return

    getBoardInfo(boardId).then(data => setBoardInfo(data))
  }, [user])

  return (
    <div className='h-full'>
      <div className='relative h-full overflow-x-scroll scrollbar scrollbar-x'>
        <div className='p-5 px-7 bg-[#00000062] mb-4 sticky left-0 blurry-background'>
          <h1 className='text-white font-semibold'>
            {optimisticBoardInfo?.title}
          </h1>
        </div>
        <div className='flex justify-start items-start gap-5 px-3'>
          {optimisticBoardInfo?.lists?.map(list => (
            <ListWrapper key={list?.list_id} className='shrink-0'>
              <List
                title={list.title}
                listId={list?.list_id}
                addCard={listId => (
                  <div className='flex justify-start mt-2 cursor-pointer'>
                    <div className='flex w-full justify-start items-center text-primary-foreground transition-all hover:bg-accent-foreground pr-2 py-1 rounded-xl'>
                      <Plus className='h-4' />
                      <p>Add a card</p>
                    </div>
                  </div>
                )}
              >
                {list?.tasks?.map(task => (
                  <div key={task?.task_id}>{task?.title}</div>
                ))}
              </List>
            </ListWrapper>
          ))}
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
