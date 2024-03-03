export interface Iresponse<T> {
    status: number
    message: string
    data: T
}