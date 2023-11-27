import { Activity, KanbanSquare, Users } from 'lucide-react'

export const workspaceFeatures: {
  value: string
  title: string
  logo: JSX.Element
}[] = [
  {
    value: 'boards',
    title: 'Boards',
    logo: <KanbanSquare className='h-5' />
  },
  {
    value: 'members',
    title: 'Members',
    logo: <Users className='h-5' />
  },
  {
    value: 'activity',
    title: 'Activity',
    logo: <Activity className='h-5' />
  }
]
