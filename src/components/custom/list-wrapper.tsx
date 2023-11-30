import { cn } from '@/lib/utils'
import React from 'react'

function ListWrapper ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('w-[300px]', className)} {...props}>
      {children}
    </div>
  )
}

export default ListWrapper
