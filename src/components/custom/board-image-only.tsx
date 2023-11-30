import { cn } from '@/lib/utils'
import { Board } from '@/types/board'
import Image from 'next/image'
import React from 'react'

function BoardImageOnly ({
  board,
  className,
  imageClassName
}: {
  board: Board
  className?: string
  imageClassName?: string
}) {
  return (
    <div className={cn('relative w-full h-full z-10', className)}>
      {board?.background_type === 'image' ? (
        <Image
          alt='board'
          src={board?.background_info}
          fill
          className={cn(
            'absolute top-0 left-0 w-full h-full object-cover z-0',
            imageClassName
          )}
        />
      ) : (
        <div
          className={cn(
            'w-full h-full z-0',
            board?.background_info,
            imageClassName
          )}
          //   style={{ backgroundColor: board?.background_info }}
        />
      )}
    </div>
  )
}

export default BoardImageOnly
