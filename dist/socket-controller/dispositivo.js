"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function dispositivoSocket(socket) {
    socket.on('dispositivo:web', (e) => {
        console.log('emisor', 'dispositivo:web', e);
        __1.io.emit('dispositivo:web', e);
    });
    socket.on('dispositivo:service', (e) => {
        console.log(e.DeviceInfo.children[5]);
        __1.io.emit('dispositivo:service', { model: e.DeviceInfo.children[5].model.content });
    });
}
exports.default = dispositivoSocket;
