export interface ILector {
    idLector: number
    create_time?: Date
    nomLector: string
    ipLector: string
    portLector: number
    userLector: string
    passLector: string
    condicionLector: number
}

export interface IRequest<T> extends ILector {
    method:string
    endpoint:string
    data: T
}

export interface IReq<T> extends ILector {
    method:string
    endpoint:string
    data: T
}