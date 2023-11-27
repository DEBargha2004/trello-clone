import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
import { ReactNode, useContext } from 'react'
import { Activity, KanbanSquare, Users } from 'lucide-react'
import { workspaceFeatures } from '@/constants/workspace-feature'
import { cn } from '@/lib/utils'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'

function AccordionContentItem ({
  children,
  selected
}: {
  children: ReactNode
  selected: boolean | number
}) {
  return (
    <div
      className={cn(
        'my-2 hover:bg-cyan-50 p-1 px-2 cursor-pointer rounded flex items-center gap-2',
        selected ? 'bg-cyan-50' : ''
      )}
    >
      {children}
    </div>
  )
}

export default function Workspace ({
  children,
  workspace_id
}: {
  children: ReactNode
  workspace_id: string
}) {
  const { activeWorkspaceFeature } = useContext(
    global_app_state_context
  ) as GlobalAppStateType
  return (
    <>
      <AccordionItem value={workspace_id}>
        <Link href={`/w/${workspace_id}/boards`}>
          <AccordionTrigger>{children}</AccordionTrigger>
        </Link>
        <AccordionContent className='pl-5'>
          {workspaceFeatures.map(feature => (
            <Link
              key={feature.value}
              href={`/w/${workspace_id}/${feature.value}`}
            >
              <AccordionContentItem
                selected={feature.value === activeWorkspaceFeature}
              >
                {feature.logo}
                {feature.title}
              </AccordionContentItem>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    </>
  )
}
