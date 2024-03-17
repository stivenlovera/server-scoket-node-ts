"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
require("./utils/model-maps");
require("dotenv/config");
const ws_1 = __importDefault(require("ws"));
const usuarioController_1 = require("./controllers/usuarioController");
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
        let parameters = {
            request: json,
            response(value) {
                return json;
            }
        };
        function events(message) {
            switch (message.event) {
                case 'usuario':
                    const usuarioController = new usuarioController_1.UsuarioController(parameters);
                    const response = parameters.response;
                    console.log(response);
                    break;
                default:
                    break;
            }
        }
        //const usuarioController = new UsuarioController(json);
        //usuarioController.create()
        console.log('Received message:', /*  message.toString(), */ json);
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
