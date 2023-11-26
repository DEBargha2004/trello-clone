'use client'

import { ReactNode } from 'react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

function BoardBackgroundContainer ({
  heading,
  children,
  collection
}: {
  heading: string
  children: ReactNode
  collection?: () => React.JSX.Element
}) {
  return (
    <div>
      <div className='flex justify-between items-center font-semibold my-2'>
        <h1>{heading}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>See More</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {collection && collection()}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default BoardBackgroundContainer
