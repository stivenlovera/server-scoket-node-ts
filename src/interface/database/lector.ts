export interface ILector {
    idLector: number
    create_time: Date
    nomLector: string
    ipLector: string
    portLector: number
    userLector: string
    passLector: string
    condicionLector: number
}

export interface ILectorData<T> extends ILector {
    data: T
}