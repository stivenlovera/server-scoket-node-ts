import express, { json } from "express";
import http from 'http'
import { Server as WebSocketServer } from 'socket.io'
import dispositivoSocket from "./socket-controller/dispositivo";
import usuarioSocket from "./socket-controller/usuario";

const app = express();
const httpServer = http.createServer(app);
export const io = new WebSocketServer(httpServer, {
    cors: {
        origin: "*",
    },
});
io.on('connection', (socket) => {
    console.log('audiencia', socket.id)
    io.emit('ping', { cliente: socket.id })
    
    /* CONTROLLER SOCKET*/
    dispositivoSocket(socket);
    usuarioSocket(socket);
});

httpServer.listen(3000);

console.log('Server en port', 3000)