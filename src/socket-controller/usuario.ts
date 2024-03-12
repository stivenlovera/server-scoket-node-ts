import { Socket } from "socket.io/dist/socket"
import { io } from ".."
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { IUsuario, IUsuarioWeb } from "../interface/hikvision/dispositivo-facial/usuario"
import sequelize from "../config/database"
import { QueryTypes } from "sequelize"
import { IIncripcionQuery } from "../interface/database/inscripcion"
import { obtenerIncripcionesQuery } from "../querys/inscripcion"
import { obtenerTodoLectoresQuery } from "../querys/lectores"
import { ILector } from "../interface/database/lector"
import moment from "moment"
import { IFaceDataRecord, IImagen } from "../interface/hikvision/dispositivo-facial/imagen"
//import '../config/database'

export default function usuarioSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

    socket.on('nuevo:usuario:web', async (usuario: IUsuarioWeb) => {
        console.log('emisor', 'nuevo:usuario:web', usuario)
        //const inscripciones = await Inscripcion.findAll();
        const inscripciones = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(), { type: QueryTypes.SELECT });
        const lectores = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT });
        let usuarios: IUsuario[] = [];
        let fotos: IImagen[] = [];
        inscripciones.map((inscripcion) => {
            usuarios.push({
                UserInfo: {
                    employeeNo: inscripcion.idCliente.toString(),
                    name: inscripcion.nomCliente,
                    userType: 'normal',
                    Valid: {
                        beginTime: moment(inscripcion.fechaInicio, "YYYY-MM-DDTHH:mm").utc().format(),
                        endTime: moment(inscripcion.fechaFin, "YYYY-MM-DDTHH:mm").utc().format(),
                        enable: true
                    }
                }
            });
            const imagen: IFaceDataRecord = {
                faceLibType: 'blackFD',
                FDID: '1',
                FPID: inscripcion.idCliente.toString()
            }
            if (inscripcion.fotoCliente != null) {
                fotos.push({
                    FaceDataRecord: JSON.stringify(imagen),
                    img: `imagenes/clientes/${inscripcion.fotoCliente!}`
                });
            }
        });
        console.log('usuarios', usuarios, 'lectores', lectores, 'fotos', fotos)
        io.emit('nuevo:usuario:service', { usuarios, lectores, fotos })
    })

    socket.on('nuevo:usuario:service', (e) => {
        //console.log(e.DeviceInfo.children[5])
        console.log(e)
        io.emit('nuevo:usuario:service', { model: e.DeviceInfo.children[5].model.content })
    })
}
