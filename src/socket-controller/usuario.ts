import { Socket } from "socket.io/dist/socket"
/* import { io } from ".." */
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { IUsuarioFoto } from "../interface/hikvision/dispositivo-facial/usuario"
import sequelize from "../config/database"
import { QueryTypes } from "sequelize"
import { IIncripcionQuery } from "../interface/database/inscripcion"
import { obtenerIncripcionesQuery } from "../querys/inscripcion"
import { obtenerTodoLectoresQuery } from "../querys/lectores"
import { ILector, ILectorData } from "../interface/database/lector"
import moment from "moment"
import { Inscripcion } from "../models/inscripcion"


export default function usuarioSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
/* 
    socket.on('store:usuario:web', async (inscripcion: Inscripcion) => {
        console.log('emisor', 'store:usuario:web', inscripcion)
        //const inscripciones = await Inscripcion.findAll();
        const clientesData = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(inscripcion.idInscripcion), { type: QueryTypes.SELECT });
        const lectoresData = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT });
        let cliente: IUsuarioFoto = {
            FaceDataRecord: {
                faceLibType: 'blackFD',
                faceURL: `${process.env.URL_WEB}/imagenes/clientes/${clientesData[0].fotoCliente}`,
                FDID: '1',
                FPID: clientesData[0].idCliente.toString(),
            },
            UserInfo: {
                employeeNo: clientesData[0].idCliente.toString(),
                name: clientesData[0].nomCliente.toString(),
                userType: 'normal',
                Valid: {
                    beginTime: moment(clientesData[0].fechaInicio, "YYYY-MM-DDTHH:mm").utc().format(),
                    endTime: moment(clientesData[0].fechaFin, "YYYY-MM-DDTHH:mm").utc().format(),
                    enable: true
                }
            }
        };

        let resultado: ILectorData<IUsuarioFoto>[] = []; +
            lectoresData.map((lector) => {
                resultado.push({
                    ...lector, data: cliente
                })
            })

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
                 FPID: inscripcion.idCliente.toString(),
                 faceURL: 'https://gym-admin.todo-soft.net/imagenes/clientes/image65ec314fd83471709977935.jpg'
             }
             if (inscripcion.fotoCliente != null) {
                 fotos.push(imagen);
             }
         }); 
        io.emit('store:usuario:service', resultado)
    })

    socket.on('nuevo:usuario:service', (e) => {
        //console.log(e.DeviceInfo.children[5])
        console.log(e)
        io.emit('nuevo:usuario:service', { model: e.DeviceInfo.children[5].model.content })
    }) */
}
