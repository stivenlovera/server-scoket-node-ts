"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inzializeSocket = void 0;
const socket_io_1 = require("socket.io");
function inzializeSocket(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
        },
    });
    io.on('connection', (socket) => {
        console.log('nueva conexion id', socket.id);
        /* io.emit('dispotivo:show', { sdsd: 'dsds' });
        io.on('dispotivo:get', async (e) => {
            console.log('escuchando...', e);
            //io.emit('dispotivo:get', { sdsd: 'dsds' });
        }) */
    });
    io.on('dato', (e) => {
        console.log('escuchando...', e);
    });
    //io.emit('dato', { sdsd: 'dsds' });
    return io;
}
exports.inzializeSocket = inzializeSocket;
