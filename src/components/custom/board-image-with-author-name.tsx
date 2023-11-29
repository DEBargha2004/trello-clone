import { cn } from '@/lib/utils'
import { BoardImage } from '@/types/image-api'
import Image from 'next/image'
import { useState } from 'react'

function BoardImageWithAuthorName ({
  boardImage,
  handleSelectBackground,
  className
}: {
  boardImage: BoardImage
  className?: string
  handleSelectBackground: (id: number) => void
}) {
  const [showAuthor, setShowAuthor] = useState(false)
  return (
    <div
      className={cn(
        'relative w-full aspect-[16/9] rounded overflow-hidden cursor-pointer',
        className
      )}
      onMouseEnter={() => setShowAuthor(true)}
      onMouseLeave={() => setShowAuthor(false)}
      onClick={() => handleSelectBackground(boardImage.id)}
    >
      <Image
        src={boardImage.previewURL}
        alt={'image'}
        width={100}
        height={100}
        key={boardImage.id}
        className='w-full absolute top-0 left-0'
      />
      <p
        className={cn(
          'absolute bottom-0 truncate w-[150px] text-slate-300 ml-1 text-[12px]',
          showAuthor ? 'block' : 'hidden'
        )}
      >
        {boardImage.user}
      </p>
    </div>
  )
}

export default BoardImageWithAuthorName
