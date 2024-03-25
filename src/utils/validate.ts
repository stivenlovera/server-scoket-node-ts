export interface IResponseError {
    statusCode: number
    StatusDescription: string
    subStatusCode: string
    errorCode: number
}
export interface IResponse {
    StatusDescription: string
    StatusCode: number
    Request: any,
    Response: any,
    
}

export const validateErrorStatus = (response: IResponse) => {
    switch (response.StatusCode) {
        case 400:
            return JSON.parse(response.Response) as IResponseError;
    
        default:
            break;
    }
}