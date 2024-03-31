export interface IResponseError {
    statusCode: number
    StatusDescription: string
    subStatusCode: string
    errorCode: number
}

export interface IRes<T> {
    statusDescription: string
    statusCode: number
    data: T,
}
export interface WSMessage {
    event: string;
    req: any
    res: any
    data: any
    notificacion: any
}

export interface PubSub {
    request: string
    message: WSMessage;
    channel: string
}
export interface Notificacion {
    heading: string
    text: string
    icon: string
    hideAfter: boolean
    bgColor: string
}
export const initialNotificacion: Notificacion = {
    heading: 'NOTIFICACION',
    text: 'Sincronizado correctamente',
    icon: 'info',
    //loader: true,        // Change it to false to disable loader
    //loaderBg: '#9EC600',  // To change the background
    hideAfter: false,
    bgColor: '#0027FF',
}

export const bgColor = (color: 'error' | 'success') => {
    switch (color) {
        case 'error':
            return '#FF0000';
        case 'success':
            return '#6658dd'
        
    }
}