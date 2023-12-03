'use client'

import { Sidebar } from '@/components/custom/sidebar'
import { ReactNode } from 'react'

export default function Layout ({ children }: { children: ReactNode }) {
  return (
    <div className='flex justify-between items-start h-full'>
      <div className='w-1/4 h-full'>
        <Sidebar />
      </div>
      <div className='w-3/4 h-full '>{children}</div>
    </div>
  )
}
