import express, { json } from "express";
import http from 'http'
import { Server as WebSocketServer } from 'socket.io'
import dispositivoSocket from "./socket-controller/dispositivo";
import usuarioSocket from "./socket-controller/usuario";
import "./utils/model-maps";
import 'dotenv/config'
import WebSocket from 'ws'
import { usuarioController } from "./controllers/usuarioController";

export interface IMessageSocket<T> {
    event: string
    type: string
    channel: string
    data: T
}

/* const app = express();
const httpServer = http.createServer(app);
export const io = new WebSocketServer(httpServer, {
    cors: {
        origin: "*",
    },
});
io.on('connection', (socket) => {
    console.log('audiencia', socket.id)
    io.emit('ping', { cliente: socket.id })
    dispositivoSocket(socket);
    usuarioSocket(socket);
}); */
export interface Message<T> {
    request: IMessageSocket<T>;
}


export const wss = new WebSocket.Server({ port: 8000 });
console.log("Iniciando server en el puerto 8000")
// WebSocket event handling
wss.on('connection', async (ws, req) => {
    console.log('Nuevo cliente detectado tipo', req.headers.token);
    try {
        await usuarioController(ws, 'usuario');
    } catch (error) {
        console.log('se genero un error')
    }
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});

export function EmitAll<T>(message: IMessageSocket<T>) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

//httpServer.listen(3000);

