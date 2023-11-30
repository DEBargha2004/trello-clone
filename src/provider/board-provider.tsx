'use client'

import { board_context as BoardContext } from '@/context/board-context'
import { BoardFullInfo } from '@/types/board'
import { useState } from 'react'

function BoardProvider ({ children }: { children: React.ReactNode }) {
  const [boardInfo, setBoardInfo] = useState<BoardFullInfo>({})
  return (
    <BoardContext.Provider value={{ boardInfo, setBoardInfo }}>
      {children}
    </BoardContext.Provider>
  )
}

export default BoardProvider
