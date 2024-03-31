import WebSocket from "ws";
import { pubSubManager } from "./config/patron";

export function Subcribe(ws: WebSocket, channel: string, message: any, event: string) {
    switch (event) {
        case 'deleted':
            obtenerTodoUsuario(ws, channel, message)
            break;
    }
}

function obtenerTodoUsuario(ws: WebSocket, channel: string, message: any) {
    //pubSubManager.subscribe(ws, channel)
    console.log('Subcribe obtenerTodoUsuario')
    //pubSubManager.subscribe(ws, channel);
    //pubSubManager.publish(ws, 'erpFrontEnd', message);
    //pubSubManager.subscribe(ws, channel);
}

function obtenerEnviarTodoUsuario(ws: WebSocket, channel: string, message: any) {
    pubSubManager.publish(ws, 'erpFrontEnd', message);
    
}