import { Dispatch, SetStateAction } from 'react'
import { List as ListType } from './board'

export type ListState = {
  listInfo: ListType
  setListInfo: Dispatch<SetStateAction<ListType>>
}
