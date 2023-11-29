import { cn } from '@/lib/utils'
import { Board } from '@/types/board'
import Image from 'next/image'
import React, { useContext, useState } from 'react'

import starFill from '../../../public/star-fill.png'
import starUnfill from '../../../public/star-unfill.png'
import updateBoardStar from '@/actions/updateBoardStar'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { cloneDeep } from 'lodash'
import BoardImageOnly from './board-image-only'

function Board ({ board }: { board: Board }) {
  const { setWorkspaces, activeWorkspace: globalActiveWorkspace } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const [showOutlineStar, setShowoutlineStar] = useState(false)
  const [showStar, setShowStar] = useState(false)

  const [optimisticBoard, setOptimisticBoard] = useState<Board>(board)

  const handleStarred = async () => {
    setOptimisticBoard(prev => {
      return {
        ...prev,
        starred: prev.starred ? 0 : 1
      }
    })
    try {
      const newStar = await updateBoardStar(
        board?.starred ? 0 : 1,
        board?.board_id
      )
      setWorkspaces(prev => {
        prev = cloneDeep(prev)
        const activeWorkspace = prev.find(
          workspace =>
            workspace.workspace_id === globalActiveWorkspace?.workspace_id
        )
        const activeWorkspaceBoard = activeWorkspace?.boards?.find(
          prev_board => prev_board.board_id === board?.board_id
        )

        if (activeWorkspaceBoard) {
          activeWorkspaceBoard.starred = newStar
        } else {
          setOptimisticBoard(board)
        }

        console.log('prev is ', prev)

        return prev
      })
    } catch (error) {
      setOptimisticBoard(board)
    }
  }
  return (
    <div
      className='w-full aspect-[16/9] rounded-md bg-slate-200 relative overflow-hidden'
      onMouseEnter={() => setShowStar(true)}
      onMouseLeave={() => setShowStar(false)}
    >
      <BoardImageOnly board={optimisticBoard} />
      <div
        className={cn(
          'w-full h-full absolute top-0 left-0 z-10 transition-all hover:bg-[#0000003b] cursor-pointer p-1'
        )}
      >
        <h1 className='text-white font-semibold pl-1'>
          {optimisticBoard?.title}
        </h1>
        <Image
          src={
            optimisticBoard?.starred
              ? showOutlineStar
                ? starUnfill
                : starFill
              : starUnfill
          }
          alt='star'
          height={15}
          width={15}
          id='star'
          className={cn(
            'absolute bottom-2 transition-all hover:scale-125',
            optimisticBoard?.starred || showStar ? 'right-2' : '-right-4'
          )}
          onMouseEnter={() => setShowoutlineStar(true)}
          onMouseLeave={() => setShowoutlineStar(false)}
          onClick={handleStarred}
        />
      </div>
    </div>
  )
}

export default Board
