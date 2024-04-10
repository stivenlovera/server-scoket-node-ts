import express, { Application, json } from "express";
import http from 'http'
import "./utils/model-maps";
import 'dotenv/config'
import WebSocket from 'ws'
import { InitializeLoggers } from "./config/logguers";
import { convertJson } from "./utils/conversiones";
import PubSubManager from "./config/patron";
import { eliminacionAutomatica } from "./controllers/eliminacionAutomatica";
import { insertIncripcion } from "./controllers/insertIncripcion";
import { PubSub } from "./utils/validate";
import { eliminacionProgramada } from "./controllers/eliminacionProgramada";
import { QueryTypes } from "sequelize";
import sequelize from "./config/database";
import { WebSocketCanal } from "./interface/database/canal-ws";
import { obtenerSocketQuery } from "./querys/sockets";

export const logger = InitializeLoggers();
var canales = Object.fromEntries(
    ['cliente-1', 'cliente-2', 'cliente-3', 'worker-1', 'worker-2', 'server'].map(canal => [canal, { message: '', subscribers: [] }])
);
class ServerSocket {
    public app: Application;
    public wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>;

    constructor() {
        this.app = express();
        const httpServer = http.createServer(this.app);
        httpServer.listen(parseInt(process.env.PORT!),
            () => { logger.info(`Iniciando server en el puerto :${process.env.PORT!}`) }
        )
        this.wss = new WebSocket.Server({ server: httpServer, path: "/devices" });
        this.route();
    }

    public route() {
        this.app.get('/', (req, res) => res.send('ACCESO  PROHIBIDO'))
    }

    public async canales(): Promise<WebSocketCanal[]> {
        return await sequelize.query<WebSocketCanal>(obtenerSocketQuery(), { type: QueryTypes.SELECT });
    }

    public async start() {
        const canales = await this.canales();
        var channels = Object.fromEntries(
            canales.map(canal => [canal.nombre_worker, { message: '', subscribers: [] }])
        );
        logger.info(`canales detectados:${convertJson(channels)}`);

        this.wss.on('connection', async (ws, req) => {

            const ip = req.socket.remoteAddress;
            logger.info(`Nuevo cliente detectado tipo: ${convertJson(req.headers["sec-websocket-protocol"]) || convertJson(req.headers["token"])} ip:${ip}`)

            ws.on('message', async (data: string) => {
                const pubSubManager = new PubSubManager(channels)
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
                eliminacionAutomatica(ws, pubSub, pubSubManager);
                insertIncripcion(ws, pubSub, pubSubManager);
                eliminacionProgramada(ws, pubSub, pubSubManager);
            });
            ws.on('error', console.error);
            ws.on('pong', () => {

            });
            ws.on('close', () => {
                logger.info(`Cliente desconectado ${convertJson(req.headers["sec-websocket-protocol"]) || convertJson(req.headers["token"])} ip:${ip}`)
            });
        });

    }
}

const serverSocket = new ServerSocket()
serverSocket.start()
/* 
const app = express();

export const httpServer = http.createServer(app);

export const wss = new WebSocket.Server({ server: httpServer, path: "/devices" });
logger.info(`Iniciando server en el puerto 3000`);

const canales = await (async () => {
    const resultPromise = await sequelize.query<WebSocketCanal>(obtenerSocketQuery(), { type: QueryTypes.SELECT });
    return resultPromise
})();

logger.info(`Creando canales ${convertJson(canales)}`);

export const pubSubManager = new PubSubManager(canales)
// WebSocket event handling
wss.on('connection', async (ws, req) => {
    const ip = req.socket.remoteAddress;
    logger.info(`Nuevo cliente detectado tipo: ${convertJson(req.headers["sec-websocket-protocol"]) || convertJson(req.headers["token"])} ip:${ip}`)
    ws.on('message', async (data: string) => {
        const pubSub = JSON.parse(data) as PubSub;
        console.log(canales)
        logger.info(`Reiniciar consulta select ----`)
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
        eliminacionProgramada(ws, pubSub);
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
) */
