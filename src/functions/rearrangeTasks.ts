import { List as ListType, Task } from '@/types/board'
import { cloneDeep } from 'lodash'

export function rearrangeTasks (lists: ListType[]) {
  lists = cloneDeep(lists)
  lists?.forEach(list => {
    if (Array.isArray(list?.tasks)) {
      const newTaskList: Task[] = []
      const first = list?.tasks?.find(task => task?.prev_id === null)
      if (first) {
        newTaskList.push(first)
        pushTasks(list?.tasks, newTaskList)
        list.tasks = newTaskList
      }
    }
  })

  return lists
}

function pushTasks (linkedList: Task[], accumulator: Task[]) {
  const next = linkedList.find(
    task => task?.prev_id === accumulator.at(-1)?.task_id
  )

  if (!next) return
  accumulator.push(next)
  pushTasks(linkedList, accumulator)
}
