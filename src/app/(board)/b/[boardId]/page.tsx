'use client'

import { getBoardInfo } from '@/actions/getBoardInfo'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

function Board ({ params }: { params: { boardId: string } }) {
  const { user } = useUser()
  useEffect(() => {
    if (!user?.id) return

    getBoardInfo(boardId).then(data => console.log('board data ', data))
  }, [user])
  const boardId = params.boardId
  return <div>{boardId}</div>
}

export default Board
