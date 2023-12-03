import { List as ListType } from '@/types/board'

/**
 * Rearranges the columns in a list of ListType objects.
 * The rearranged lists follow a singly linked list format
 *
 * @param {ListType[]} lists - The list of ListType objects to be rearranged.
 * @return {void}
 */
export function rearrangeColumns (lists: ListType[]) {
  const firstList = lists?.find(list => list.prev_id === null)

  const rearrangedLists = []
  if (!firstList) {
    return lists
  }
  rearrangedLists.push(firstList)
  pushColumn(lists, rearrangedLists)
  return rearrangedLists
}

/**
 * Recursively pushes the next list in the linked list to the accumulator array.
 *
 * @param {ListType[]} linkedList - The linked list of lists.
 * @param {ListType[]} accumulator - The array to store the lists.
 */
function pushColumn (linkedList: ListType[], accumulator: ListType[]) {
  const firstList = accumulator.at(-1)
  const nextList = linkedList.find(l => l.prev_id === firstList?.list_id)

  if (!nextList) {
    return
  }
  accumulator.push(nextList)
  pushColumn(linkedList, accumulator)
}
