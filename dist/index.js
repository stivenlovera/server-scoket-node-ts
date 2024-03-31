"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = exports.httpServer = exports.logger = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("./utils/model-maps");
require("dotenv/config");
const ws_1 = __importDefault(require("ws"));
const logguers_1 = require("./config/logguers");
const conversiones_1 = require("./utils/conversiones");
const patron_1 = require("./config/patron");
const eliminacionAutomatica_1 = require("./controllers/eliminacionAutomatica");
const insertIncripcion_1 = require("./controllers/insertIncripcion");
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
exports.logger = (0, logguers_1.InitializeLoggers)();
const app = (0, express_1.default)();
exports.httpServer = http_1.default.createServer(app);
exports.wss = new ws_1.default.Server({ server: exports.httpServer, path: "/devices" });
exports.logger.info(`Iniciando server en el puerto 3000`);
// WebSocket event handling
exports.wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.socket.remoteAddress;
    exports.logger.info(`Nuevo cliente detectado tipo: ${(0, conversiones_1.convertJson)(req.headers["sec-websocket-protocol"]) || (0, conversiones_1.convertJson)(req.headers["token"])} ip:${ip}`);
    ws.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const pubSub = JSON.parse(data);
        switch (pubSub.request) {
            case 'PUBLISH':
                patron_1.pubSubManager.publish(ws, pubSub.channel, pubSub.message);
                break;
            case 'SUBSCRIBE':
                patron_1.pubSubManager.subscribe(ws, pubSub.channel);
                break;
        }
        //PROCESOS
        (0, eliminacionAutomatica_1.eliminacionAutomatica)(ws, pubSub);
        (0, insertIncripcion_1.insertIncripcion)(ws, pubSub);
    }));
    ws.on('error', console.error);
    ws.on('pong', () => {
    });
    ws.on('close', () => {
        exports.logger.info(`Cliente desconectado ${(0, conversiones_1.convertJson)(req.headers["sec-websocket-protocol"]) || (0, conversiones_1.convertJson)(req.headers["token"])} ip:${ip}`);
        //clearInterval(interval);
    });
}));
app.get('/', (req, res) => res.send('ACCESO  PROHIBIDO'));
exports.httpServer.listen(parseInt(process.env.PORT), () => console.log(`Lisening on port :${process.env.PORT}`));
