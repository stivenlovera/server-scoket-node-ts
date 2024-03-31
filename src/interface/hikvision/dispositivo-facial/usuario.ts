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

export interface Search {
  UserInfoSearchCond: UserInfoSearchCond
}

export interface UserInfoSearchCond {
  searchID: string
  maxResults: number
  searchResultPosition: number
}

/*obtener todo */
export interface SearchResponse {
  UserInfoSearch: UserInfoSearch
}

export interface UserInfoSearch {
  searchID: string
  responseStatusStrg: string
  numOfMatches: number
  totalMatches: number
  UserInfo: UserInfo[]
}

export interface UserInfo {
  employeeNo: string
  name: string
  userType: string
  closeDelayEnabled: boolean
  Valid?: IValid
  belongGroup: string
  password: string
  doorRight: string
  RightPlan?: IRightPlan[]
  maxOpenDoorTime: number
  openDoorTime: number
  roomNumber: number
  floorNumber: number
  localUIRight: boolean
  gender: string
  numOfCard: number
  numOfFP: number
  numOfFace: number
  groupId: number
  localAtndPlanTemplateId: number
}

/*delete usuarios */
export interface UsuarioDelete {
  UserInfoDelCond: UserInfoDelCond
}

export interface UserInfoDelCond {
  EmployeeNoList: EmployeeNoList[]
}

export interface EmployeeNoList {
  employeeNo: string
}
