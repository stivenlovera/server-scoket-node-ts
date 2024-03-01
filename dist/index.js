"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
app.get('/accion', (req, res) => {
    io.emit('response', 'haz esto!');
    res.send('acccion enviada');
});
io.on('connection', (socket) => {
    console.log('nueva conexion id', socket.id);
    socket.emit('response', 'haz esto!');
    socket.on('store:data', (data) => {
        console.log(data);
    });
});
httpServer.listen(3000);
console.log('Server en port', 3000);
