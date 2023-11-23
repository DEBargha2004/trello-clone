import { Dispatch, SetStateAction } from 'react'
import { UserData } from './user'
import { WorkSpaceType } from './workspace'

export type GlobalAppStateType = {
  userInfo: UserData
  setUserInfo: Dispatch<SetStateAction<UserData>>
  workspacesInfo: WorkSpaceType
  setWorkspacesInfo: Dispatch<SetStateAction<WorkSpaceType>>
}
