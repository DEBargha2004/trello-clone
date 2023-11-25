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

function Board ({ board }: { board: Board }) {
  const { setWorkspaces } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const [showOutlineStar, setShowoutlineStar] = useState(false)
  const [showStar, setShowStar] = useState(false)

  const handleStarred = async () => {
    if (board?.starred) {
      const newStar = await updateBoardStar(
        board?.starred ? 0 : 1,
        board?.board_id
      )
      setWorkspaces(prev => {
        prev = cloneDeep(prev)
        const activeWorkspace = prev.find(
          workspace => workspace.workspace_id === board?.workspace_id
        )
        const activeWorkspaceBoard = activeWorkspace?.boards?.find(
          prev_board => prev_board.board_id === board?.board_id
        )
        if (activeWorkspaceBoard) {
          activeWorkspaceBoard.starred = newStar
        }

        return prev
      })
    }
  }
  return (
    <div
      className='w-full aspect-[16/9] rounded-md bg-slate-200 relative overflow-hidden'
      onMouseEnter={() => setShowStar(true)}
      onMouseLeave={() => setShowStar(false)}
    >
      {board?.background_type === 'image' ? (
        <Image
          alt='board'
          src={board?.background_info}
          fill
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      ) : (
        <div
          className='w-full h-full'
          style={{ backgroundColor: board?.background_info }}
        />
      )}
      <div
        className={cn(
          'w-full h-full absolute top-0 left-0 z-10 transition-all hover:bg-[#0000003b] cursor-pointer p-1'
        )}
      >
        <h1 className='text-white font-semibold'>{board?.title}</h1>
        <Image
          src={
            board?.starred
              ? showOutlineStar
                ? starUnfill
                : starFill
              : starUnfill
          }
          alt='star'
          height={15}
          width={15}
          className={cn(
            'absolute bottom-2 transition-all hover:scale-125',
            board?.starred || showStar ? 'right-2' : '-right-4'
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
