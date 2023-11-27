import { Trello, Users2 } from 'lucide-react'
import React from 'react'

export const boardSidebarFeature: {
  id: string
  title: string
  logo: React.JSX.Element
}[] = [
  {
    id: 'boards',
    title: 'Boards',
    logo: <Trello className='h-4' />
  },
  {
    id: 'members',
    title: 'Members',
    logo: <Users2 className='h-4' />
  }
]
