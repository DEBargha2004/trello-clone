import { Dispatch, SetStateAction } from 'react'
import { BoardFullInfo } from './board'

export type BoardState = {
  boardInfo: BoardFullInfo
  setBoardInfo: Dispatch<SetStateAction<BoardFullInfo>>
}
