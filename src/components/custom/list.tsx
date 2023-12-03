import { useForm } from 'react-hook-form'
import { Textarea } from '../ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardCreationSchema } from '@/schema/card-creation-schema'
import { useContext, useEffect, useState } from 'react'
import { BoardFullInfo, List as ListType, Task } from '@/types/board'
import { Plus } from 'lucide-react'
import { list_context } from '@/context/list_context'
import { ListState } from '@/types/list-state'
import { createTask } from '@/actions/createTask'
import { global_app_state_context } from '@/context/global-app-state-context'
import { GlobalAppStateType } from '@/types/global-app-state'
import { board_context } from '@/context/board-context'
import { BoardState } from '@/types/board-state'
import { cloneDeep } from 'lodash'
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  Droppable,
  DroppableProvided
} from '@hello-pangea/dnd'

function List ({
  title,
  list,
  draggableProps
}: {
  title: string
  list: ListType
  draggableProps: DraggableProvided
}) {
  const { setListInfo, listInfo } = useContext(list_context) as ListState
  const { setBoardInfo } = useContext(board_context) as BoardState
  const { activeWorkspace } = useContext(
    global_app_state_context
  ) as GlobalAppStateType

  const [taskTextarea, setTaskTextarea] = useState<{
    visible: boolean
    listId: string | null
  }>({
    visible: false,
    listId: null
  })

  const {
    register: taskRegister,
    handleSubmit: taskHandleSubmit,
    reset: taskReset,
    getValues: getTaskValues,
    formState: { errors: taskErrors, isSubmitting: taskIsSubmitting }
  } = useForm({
    resolver: zodResolver(cardCreationSchema)
  })

  //@ts-ignore
  const handleCreateTask = async e => {
    const { title } = getTaskValues()

    if (title) {
      const prev_id = list?.tasks?.length ? list.tasks.at(-1)?.task_id : null
      const task_id = `task_${crypto.randomUUID()}`
      const optimisticTask: Task = {
        task_id,
        title,
        description: '',
        prev_id,
        timestamp_created: new Date().toISOString()
      }

      // console.log('optimistic task ', optimisticTask)

      // setListInfo(prev => ({
      //   ...prev,
      //   tasks: Array.isArray(prev?.tasks)
      //     ? [...prev?.tasks, optimisticTask]
      //     : [optimisticTask]
      // }))

      setBoardInfo(prev => {
        prev = cloneDeep(prev)
        const currentList = prev?.lists?.find(l => l?.list_id === list?.list_id)
        if (Array.isArray(currentList?.tasks)) {
          currentList?.tasks?.push(optimisticTask)
        } else {
          currentList.tasks = [optimisticTask]
        }
        return prev
      })

      setTaskTextarea(prev => ({
        ...prev,
        visible: false,
        listId: ''
      }))
      try {
        const task = await createTask({
          list_id: list?.list_id,
          title,
          workspace_id: activeWorkspace?.workspace_id,
          description: '',
          prev_id,
          task_id
        })

        // console.log('database task created ', task)

        // setBoardInfo(prev => {
        //   prev = cloneDeep(prev)
        //   const currentList = prev?.lists?.find(
        //     l => l?.list_id === list?.list_id
        //   )

        //   if (Array.isArray(currentList?.tasks)) {
        //     currentList?.tasks?.push(task)
        //   } else {
        //     currentList.tasks = [task]
        //   }

        //   return prev
        // })
      } catch (error) {
        // setListInfo(list)
      }
    }
    setTaskTextarea(prev => ({
      ...prev,
      visible: false,
      listId: ''
    }))
    taskReset()
  }

  // useEffect(() => {
  //   setListInfo(list)
  // }, [list])

  return (
    <div className='bg-[#0000009c] rounded-xl p-3'>
      <h1
        className='font-semibold text-primary-foreground pl-2 mb-2'
        {...draggableProps.dragHandleProps}
      >
        {title}
      </h1>
      <Droppable droppableId={list?.list_id}>
        {droppableProvided => (
          <div
            className='min-h-[10px]'
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
          >
            {list?.tasks?.map((t, t_index) => (
              <Draggable
                draggableId={t?.task_id}
                index={t_index}
                key={t?.task_id}
              >
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    key={t?.task_id}
                    className={`p-3 px-2 ${
                      draggableSnapshot.isDragging
                        ? 'bg-[#000000d8]'
                        : 'bg-[#0000008e]'
                    } text-white rounded-xl mb-2`}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                  >
                    {t?.title}
                  </div>
                )}
              </Draggable>
            ))}
            {taskTextarea.listId === list?.list_id && taskTextarea.visible ? (
              <form onSubmit={taskHandleSubmit(handleCreateTask)} className=''>
                <Textarea
                  autoFocus
                  {...taskRegister('title')}
                  onBlur={handleCreateTask}
                  className='bg-transparent border-none text-white'
                />
              </form>
            ) : null}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
      <div>
        <div className='flex justify-start mt-2 cursor-pointer'>
          <div
            className='flex w-full justify-start items-center text-primary-foreground transition-all hover:bg-accent-foreground pr-2 py-1 rounded-xl'
            onClick={() => {
              setTaskTextarea(prev => ({
                ...prev,
                listId: list?.list_id,
                visible: true
              }))
            }}
          >
            <Plus className='h-4' />
            <p>Add a card</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
