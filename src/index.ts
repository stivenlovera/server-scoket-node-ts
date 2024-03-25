import express, { json } from "express";
import http from 'http'
import { Server as WebSocketServer } from 'socket.io'
import "./utils/model-maps";
import 'dotenv/config'
import WebSocket from 'ws'
import { usuarioController } from "./controllers/usuarioController";
import { InitializeLoggers } from "./config/logguers";
import morgan from "morgan";

export interface IMessageSocket<T> {
    event: string
    type: string
    channel: string
    data: T
    adjuntos: any
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

export const logger = InitializeLoggers();
const app = express();

const httpServer = http.createServer(app);

export const wss = new WebSocket.Server({ server: httpServer, path: "/devices" });
logger.info(`Iniciando server en el puerto 3000`)

// WebSocket event handling
wss.on('connection', async (ws, req) => {
    logger.info(`Nuevo cliente detectado tipo: ${req.headers.token}`)
    try {
        await usuarioController(ws, 'usuario');
        //await fotoController(ws, 'foto');
    } catch (error) {
        logger.warn(`Se genero un error`)
    }
    ws.on('close', () => {
        logger.info(`Cliente desconectado ${req.headers.token}`)
    });
});

export function EmitAll<T>(message: IMessageSocket<T>) {
    logger.info(`Responder a todos => ${JSON.stringify(message, null, "\t")}`)
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
app.get('/', (req, res) => res.send('Hello World!'))

httpServer.listen(parseInt(process.env.PORT!),
    () => console.log(`Lisening on port :${process.env.PORT!}`)
)
