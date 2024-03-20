import { Socket } from "socket.io/dist/socket"
/* import { io } from ".." */
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export default function dispositivoSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

/*     socket.on('dispositivo:web', (e) => {
        console.log('emisor', 'dispositivo:web', e)
        io.emit('dispositivo:web', e)
    })

    socket.on('dispositivo:service', (e) => {
        console.log(e.DeviceInfo.children[5])
        io.emit('dispositivo:service', { model: e.DeviceInfo.children[5].model.content })
    }) */
}
