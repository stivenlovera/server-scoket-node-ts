import { Server as WebSocketServer } from 'socket.io'
import http from 'http'
export function inzializeSocket(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    const io = new WebSocketServer(httpServer, {
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

    io.on('dato',  (e) => {
        console.log('escuchando...', e);
        
    })
    //io.emit('dato', { sdsd: 'dsds' });

    return io;
}


