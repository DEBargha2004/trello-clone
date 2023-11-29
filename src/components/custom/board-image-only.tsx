import { cn } from '@/lib/utils'
import { Board } from '@/types/board'
import Image from 'next/image'
import React from 'react'

function BoardImageOnly ({
  board,
  className
}: {
  board: Board
  className?: string
}) {
  return (
    <div className={cn('relative w-full h-full', className)}>
      {board?.background_type === 'image' ? (
        <Image
          alt='board'
          src={board?.background_info}
          fill
          className={cn('absolute top-0 left-0 w-full h-full object-cover')}
        />
      ) : (
        <div
          className={cn('w-full h-full', board?.background_info)}
          //   style={{ backgroundColor: board?.background_info }}
        />
      )}
    </div>
  )
}

export default BoardImageOnly
