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
exports.EmitAll = exports.wss = exports.logger = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("./utils/model-maps");
require("dotenv/config");
const ws_1 = __importDefault(require("ws"));
const usuarioController_1 = require("./controllers/usuarioController");
const logguers_1 = require("./config/logguers");
exports.logger = (0, logguers_1.InitializeLoggers)();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
exports.wss = new ws_1.default.Server({ server: httpServer, path: "/devices" });
exports.logger.info(`Iniciando server en el puerto 3000`);
// WebSocket event handling
exports.wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    exports.logger.info(`Nuevo cliente detectado tipo: ${req.headers.token}`);
    try {
        yield (0, usuarioController_1.usuarioController)(ws, 'usuario');
        //await fotoController(ws, 'foto');
    }
    catch (error) {
        exports.logger.warn(`Se genero un error`);
    }
    ws.on('close', () => {
        exports.logger.info(`Cliente desconectado ${req.headers.token}`);
    });
}));
function EmitAll(message) {
    exports.logger.info(`Responder a todos => ${JSON.stringify(message, null, "\t")}`);
    exports.wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
exports.EmitAll = EmitAll;
app.get('/', (req, res) => res.send('Hello World!'));
httpServer.listen(parseInt(process.env.PORT), () => console.log(`Lisening on port :${process.env.PORT}`));
