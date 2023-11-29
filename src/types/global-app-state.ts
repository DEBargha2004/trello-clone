import { Dispatch, SetStateAction } from 'react'
import { UserData } from './user'
import { WorkSpaceType } from './workspace'
import { ImageApiData } from './image-api'

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
  activeWorkspace: WorkSpaceType | undefined
  activeWorkspaceFeature: ActiveWorkspaceFeature
  setActiveWorkspaceFeature: Dispatch<SetStateAction<ActiveWorkspaceFeature>>
  activeWorkspaceId: string | null | undefined
  setActiveWorkspaceId: Dispatch<SetStateAction<string | null | undefined>>
  boardImages: ImageApiData | null | undefined
  setBoardImages: Dispatch<SetStateAction<ImageApiData | null | undefined>>
}
