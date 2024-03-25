import WebSocket from "ws"
import { EmitAll, IMessageSocket, logger } from "..";
import sequelize from "../config/database";
import { IIncripcionQuery } from "../interface/database/inscripcion";
import { obtenerIncripcionesQuery } from "../querys/inscripcion";
import { QueryTypes } from "sequelize";
import { ILector, IRequest } from "../interface/database/lector";
import { obtenerTodoLectoresQuery } from "../querys/lectores";
import { IUserInfo, IUsuarioDevice } from "../interface/hikvision/dispositivo-facial/usuario";
import moment from "moment";
import { convertJson } from "../utils/conversiones";
import { IResponse, IResponseError, validateErrorStatus } from "../utils/validate";
import { IFaceDataRecord } from "../interface/hikvision/dispositivo-facial/foto";
import { Inscripcion } from "../models/inscripcion";

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

    const UserInfo: IUsuarioDevice = {
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
    }

    const FaceDataRecord: IFaceDataRecord = {
        faceLibType: 'blackFD',
        faceURL: `${process.env.URL_WEB}/imagenes/clientes/${clientesData[0].fotoCliente}`,
        FDID: '1',
        FPID: clientesData[0].idCliente.toString(),
    }

    //cargar datos
    const data: IRequest<IUsuarioDevice>[] = [];

    lectoresData.map((lector) => {
        const usuario: IRequest<IUsuarioDevice> = {
            ...lector,
            method: 'POST',
            endpoint: '/ISAPI/AccessControl/UserInfo/Record?format=json',
            data: UserInfo
        }
        data.push(usuario);
        const foto: IRequest<IFaceDataRecord> = {
            ...lector,
            method: 'POST',
            endpoint: '/ISAPI/Intelligent/FDLib/FDSetUp?format=json',
            data: FaceDataRecord
        }
        //data.push(foto);
    });

    const response: IMessageSocket<IRequest<IUsuarioDevice>[]> = {
        data: data,
        channel: 'server',
        event: message.event,
        type: message.type,
        adjuntos: {}
    }
    EmitAll(response)
}

export interface IStore {
    statusCode: number
    StatusDescription: string
    subStatusCode: string
}
async function store(message: IMessageSocket<IResponse[]>) {
    //logger.info(`usuarioController/store ${convertJson(message)}`);
    message.data.map((lector) => {
        if (lector.StatusCode == 200) {
            const request = JSON.parse(lector.Response) as IStore;
            logger.info(`usuarioController/store ${convertJson(lector)}`);
            Inscripcion

        } else {
            //const error = validateErrorStatus(lector);
            logger.error(`usuarioController/store ${convertJson(lector)}`);
        }
    })
}