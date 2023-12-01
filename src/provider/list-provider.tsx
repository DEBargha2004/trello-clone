'use client'

import { list_context as ListContext } from '@/context/list_context'
import { List as ListType } from '@/types/board'
import { useState } from 'react'

export default function ListProvider ({
  children
}: {
  children: React.ReactNode
}) {
  const [listInfo, setListInfo] = useState<ListType>()
  return (
    <ListContext.Provider value={{ listInfo, setListInfo }}>
      {children}
    </ListContext.Provider>
  )
}
