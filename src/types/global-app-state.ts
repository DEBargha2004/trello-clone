import { Dispatch, SetStateAction } from 'react'
import { UserData } from './user'
import { WorkSpaceType } from './workspace'

export type ActiveWorkspaceFeature =
  | 'boards'
  | 'members'
  | 'activity'
  | ''
  | null
  | undefined

export type GlobalAppStateType = {
  userInfo: UserData
  setUserInfo: Dispatch<SetStateAction<UserData>>
  workspaces: WorkSpaceType[]
  setWorkspaces: Dispatch<SetStateAction<WorkSpaceType[]>>
  activeWorkspace: WorkSpaceType
  setActiveWorkspace: Dispatch<SetStateAction<WorkSpaceType>>
  activeWorkspaceFeature: ActiveWorkspaceFeature
  setActiveWorkspaceFeature: Dispatch<SetStateAction<ActiveWorkspaceFeature>>
}
