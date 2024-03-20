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
exports.EmitAll = exports.wss = void 0;
require("./utils/model-maps");
require("dotenv/config");
const ws_1 = __importDefault(require("ws"));
const usuarioController_1 = require("./controllers/usuarioController");
exports.wss = new ws_1.default.Server({ port: 8000 });
console.log("Iniciando server en el puerto 8000");
// WebSocket event handling
exports.wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Nuevo cliente detectado tipo', req.headers.token);
    try {
        yield (0, usuarioController_1.usuarioController)(ws, 'usuario');
    }
    catch (error) {
        console.log('se genero un error');
    }
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
}));
function EmitAll(message) {
    exports.wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
exports.EmitAll = EmitAll;
//httpServer.listen(3000);
