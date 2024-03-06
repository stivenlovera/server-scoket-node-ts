export interface IUsuario {
    UserInfo: UserInfo
}

export interface UserInfo {
    employeeNo: string
    name: string
    userType: string
    Valid: Valid
}

export interface Valid {
    enable: boolean
    beginTime: string
    endTime: string
}

export interface IUsuarioWeb {
    employeeNo: string
    name: string
    userType: string
    enable: boolean;
    beginTime: string
    endTime: string
}

///web

