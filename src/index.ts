import express, { json } from "express";
import http from 'http'
import { Server as WebSocketServer } from 'socket.io'
import dispositivoSocket from "./socket-controller/dispositivo";
import usuarioSocket from "./socket-controller/usuario";
import "./utils/model-maps";
import 'dotenv/config'
import WebSocket from 'ws'
import { UsuarioController } from "./controllers/usuarioController";

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
    response: <T>(value: IMessageSocket<T>) => IMessageSocket<T>;
}


export const wss = new WebSocket.Server({ port: 8000 });
console.log("Iniciando server en el puerto 8000")
// WebSocket event handling
wss.on('connection', (ws) => {
    console.log('Nuevo cliente detectado');

    // Event listener for incoming messages
    ws.on('message', (message: string) => {
        var json = JSON.parse(message);


        /* json.event='usuario';
        json.channel='web';
        json.type='store:create' */
        let parameters: Message<any> = {
            request: json,
            response(value) {
                return json;
            }
        };
        function events<T>(message: IMessageSocket<T>) {
            switch (message.event) {
                case 'usuario':
                    const usuarioController = new UsuarioController(parameters);
                    const response = parameters.response;
                    console.log(response)
                    break;

                default:
                    break;
            }
        }

        //const usuarioController = new UsuarioController(json);
        //usuarioController.create()


        console.log('Received message:',/*  message.toString(), */ json);
        // Broadcast the message to all connected clients
        /* switch (json.type) {
            case 'store:init':
                console.log('enviar a todos')
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
                break;
            case 'store:finalize':
                console.log('gracias')
                
                break;
            default:
                break;
        } */
    });
    // Event listener for client disconnection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});

//httpServer.listen(3000);

