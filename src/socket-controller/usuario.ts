import { Socket } from "socket.io/dist/socket"
import { io } from ".."
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { IUsuario, IUsuarioWeb } from "../interface/hikvision/dispositivo-facial/usuario"
import { Inscripcion } from "../models/inscripcion"
import sequelize from "../config/database"
import { QueryTypes } from "sequelize"
import { Cliente } from "../interface/database/clientes"
import { Cliente as ClienteModel } from "../models/cliente"
//import '../config/database'

export default function usuarioSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

    socket.on('nuevo:usuario:web', async (usuario: IUsuarioWeb) => {
        console.log('emisor', 'nuevo:usuario:web', usuario)
        const inscripciones = await Inscripcion.findAll();
        const cliente = await sequelize.query<Cliente>(`SELECT * FROM cliente`, { type: QueryTypes.SELECT });
        const insert = await ClienteModel.create({
            idCliente:15,
            CondicionCliente: 1,
            dirCliente: 'sdf',
            docCliente: 1545,
            mailCliente: 'dsf',
            nomCliente: 'dsf',
            tel1Cliente: 0,
            tel2Cliente: 0,
        });
        console.log(cliente[0], insert)
        io.emit('nuevo:usuario:web', { inscripciones, cliente })
    })

    socket.on('nuevo:usuario:service', (e) => {
        //console.log(e.DeviceInfo.children[5])
        console.log(e)
        io.emit('nuevo:usuario:service', { model: e.DeviceInfo.children[5].model.content })
    })
}
