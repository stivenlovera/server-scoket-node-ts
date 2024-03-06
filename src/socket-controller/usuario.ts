import { Socket } from "socket.io/dist/socket"
import { io } from ".."
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { IUsuario, IUsuarioWeb } from "../interface/hikvision/dispositivo-facial/usuario"
import { Inscripcion } from "../models/inscripcion"

export default function usuarioSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

    socket.on('nuevo:usuario:web', async (usuario: IUsuarioWeb) => {
        console.log('emisor', 'nuevo:usuario:web', usuario)
        const inscripciones = await Inscripcion.findAll();
        console.log(inscripciones)
        //io.emit('nuevo:usuario:web', usuario)
    })

    socket.on('nuevo:usuario:service', (e) => {
        //console.log(e.DeviceInfo.children[5])
        console.log(e)
        io.emit('nuevo:usuario:service', { model: e.DeviceInfo.children[5].model.content })
    })
}
