import express, { json } from "express";
import { Server as WebSocketServer } from 'socket.io'
import http from 'http'

const app = express();
const httpServer = http.createServer(app);
const io = new WebSocketServer(httpServer);

app.get('/accion', (req, res) => {
    io.emit('response', 'haz esto!');
    res.send('acccion enviada')
})

io.on('connection', (socket) => {
    console.log('nueva conexion id', socket.id);
    socket.emit('response', 'haz esto!');
    socket.on('store:data', (data) => {
        console.log(data)
    });
})

httpServer.listen(3000);



console.log('Server en port', 3000)