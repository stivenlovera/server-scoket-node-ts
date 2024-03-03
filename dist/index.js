"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dispositivo_1 = __importDefault(require("./socket-controller/dispositivo"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
exports.io.on('connection', (socket) => {
    console.log('audiencia', socket.id);
    exports.io.emit('ping', { cliente: socket.id });
    /* CONTROLLER SOCKET*/
    (0, dispositivo_1.default)(socket);
});
httpServer.listen(3000);
console.log('Server en port', 3000);
