import WebSocket from "ws"
import { EmitAll, IMessageSocket } from "..";
import sequelize from "../config/database";
import { IIncripcionQuery } from "../interface/database/inscripcion";
import { obtenerIncripcionesQuery } from "../querys/inscripcion";
import { QueryTypes } from "sequelize";
import { ILector, ILectorData } from "../interface/database/lector";
import { obtenerTodoLectoresQuery } from "../querys/lectores";
import { IUsuarioFoto } from "../interface/hikvision/dispositivo-facial/usuario";
import moment from "moment";

export const usuarioController = async (ws: WebSocket, event: string) => {
    ws.on('message', async (message: string) => {
        const data = JSON.parse(message.toString());
        if (data.event == event) {
            switch (data.type) {
                case 'store:init':
                    await create(data);
                    break;
                case 'store:finalize':
                    await store(data);
                    break;
                default:
                    console.log(`event: ${event}, type: no identificado..`)
                    break;
            }
        }
    });


}

interface IReqCreate {
    idInscripcion: number
}
async function create(message: IMessageSocket<IReqCreate>) {
    const clientesData = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(message.data.idInscripcion), { type: QueryTypes.SELECT });
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
    const response: IMessageSocket<ILectorData<IUsuarioFoto>[]> = {
        data: resultado,
        channel: 'server',
        event: message.event,
        type: message.type,
    }
    EmitAll(response)
}

interface IReqCreate {
    idInscripcion: number
}
async function store(message: IMessageSocket<IReqCreate>) {
    console.log(message)
}