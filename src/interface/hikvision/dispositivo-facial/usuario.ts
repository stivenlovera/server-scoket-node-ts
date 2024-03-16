import { IFaceDataRecord } from "./foto"

export interface IUsuarioFoto {
  UserInfo: IUserInfo,
  FaceDataRecord: IFaceDataRecord
}

export interface IUserInfo {
  employeeNo: string
  name: string
  userType: string
  gender?: string
  localUIRight?: boolean
  maxOpenDoorTime?: number
  Valid: IValid
  doorRight?: string
  RightPlan?: IRightPlan[]
  groupId?: number
  userVerifyMode?: string
}

export interface IValid {
  enable: boolean
  beginTime: string
  endTime: string
  timeType?: string
}

export interface IRightPlan {
  doorNo: number
  planTemplateNo: string
}