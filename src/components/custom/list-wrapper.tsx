import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'

const ListWrapper = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  // Use the forwarded ref on a DOM element or React component
  return (
    <div className={cn('w-[300px]', className)} {...props} ref={ref}>
      {children}
    </div>
  )
})

export default ListWrapper
