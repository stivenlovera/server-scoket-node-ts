"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
require("./utils/model-maps");
require("dotenv/config");
const ws_1 = __importDefault(require("ws"));
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
exports.wss = new ws_1.default.Server({ port: 8000 });
console.log("Iniciando server en el puerto 8000");
// WebSocket event handling
exports.wss.on('connection', (ws) => {
    console.log('Nuevo cliente detectado');
    // Event listener for incoming messages
    ws.on('message', (message) => {
        var json = JSON.parse(message);
        /* json.event='usuario';
        json.channel='web';
        json.type='store:create' */
        const usuario = () => {
        };
        //const usuarioController = new UsuarioController(json);
        //usuarioController.create()
        console.log('Received message:', /*  message.toString(), */ json);
        // Broadcast the message to all connected clients
        switch (json.type) {
            case 'store:init':
                console.log('enviar a todos');
                exports.wss.clients.forEach((client) => {
                    if (client.readyState === ws_1.default.OPEN) {
                        client.send(message.toString());
                    }
                });
                break;
            case 'store:finalize':
                console.log('gracias');
                /* wss.clients.forEach((client) => {
                    const response: IMessageSocket<string> = {
                        channel: "store",
                        data: "recibido",
                        emit: "usuario"
                    }

                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(response));
                    }
                }); */
                break;
            default:
                break;
        }
    });
    // Event listener for client disconnection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});
//httpServer.listen(3000);
