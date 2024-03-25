export interface IUsuarioDevice {
  UserInfo: IUserInfo
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
  doorNo?: number
  planTemplateNo?: string
}

export interface IUsuarioDeviceDestroy {
  UserInfoDelCond: UserInfoDelCond
}

export interface UserInfoDelCond {
  EmployeeNoList: EmployeeNoList[]
}

export interface EmployeeNoList {
  employeeNo: string
}
