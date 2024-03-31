import express, { json } from "express";
import http from 'http'
import "./utils/model-maps";
import 'dotenv/config'
import WebSocket from 'ws'
import { InitializeLoggers } from "./config/logguers";
import { convertJson } from "./utils/conversiones";
import { pubSubManager } from "./config/patron";
import { eliminacionAutomatica } from "./controllers/eliminacionAutomatica";
import { insertIncripcion } from "./controllers/insertIncripcion";
import { PubSub } from "./utils/validate";


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

export const logger = InitializeLoggers();
const app = express();

export const httpServer = http.createServer(app);

export const wss = new WebSocket.Server({ server: httpServer, path: "/devices" });
logger.info(`Iniciando server en el puerto 3000`)

// WebSocket event handling
wss.on('connection', async (ws, req) => {
    const ip = req.socket.remoteAddress;
    logger.info(`Nuevo cliente detectado tipo: ${convertJson(req.headers["sec-websocket-protocol"]) || convertJson(req.headers["token"])} ip:${ip}`)
    ws.on('message', async (data: string) => {
        const pubSub = JSON.parse(data) as PubSub;

        switch (pubSub.request) {
            case 'PUBLISH':
                pubSubManager.publish(ws, pubSub.channel, pubSub.message);

                break;
            case 'SUBSCRIBE':
                pubSubManager.subscribe(ws, pubSub.channel);
                break;
        }
        //PROCESOS
        eliminacionAutomatica(ws, pubSub);
        insertIncripcion(ws, pubSub);

    });
    ws.on('error', console.error);
    ws.on('pong', () => {

    });
    ws.on('close', () => {
        logger.info(`Cliente desconectado ${convertJson(req.headers["sec-websocket-protocol"]) || convertJson(req.headers["token"])} ip:${ip}`)
        //clearInterval(interval);
    });
});

app.get('/', (req, res) => res.send('ACCESO  PROHIBIDO'))

httpServer.listen(parseInt(process.env.PORT!),
    () => console.log(`Lisening on port :${process.env.PORT!}`)
)
