import WebSocket from "ws";
import { convertJson } from "../utils/conversiones";
import { QueryTypes } from "sequelize";
import sequelize from "../config/database";
import { ILector, IReq, IRequest } from "../interface/database/lector";
import { obtenerTodoLectoresQuery } from "../querys/lectores";
import { IUsuarioDevice, Search, SearchResponse, UsuarioDelete } from "../interface/hikvision/dispositivo-facial/usuario";
import { IRes, PubSub, bgColor, initialNotificacion } from "../utils/validate";
import moment from "moment";
import { IIncripcionQuery } from "../interface/database/inscripcion";
import { obtenerIncripcionesQuery, updateIncripcionesQuery } from "../querys/inscripcion";
import { IFaceDataRecord } from "../interface/hikvision/dispositivo-facial/foto";
import { logger } from "..";
import PubSubManager from "../config/patron";

export function insertIncripcion(ws: WebSocket, pubSub: PubSub, pubSubManager: PubSubManager) {
    switch (pubSub.message.event) {
        case 'insertInscripcion:init':
            insertInscripcion(ws, pubSub, pubSubManager)
            break;
        case 'insertInscripcion:finalize':
            insertFotoInscripcion(ws, pubSub, pubSubManager)
            break;
        case 'insertFotoInscripcion:finalize':
            notificarFotoInscripcion(ws, pubSub, pubSubManager)
            break;
        case 'insertInscripcionNotificar:finalize':
            //confirmAutomaticoUsuario(ws, pubSub)
            break;
    }
}
interface IDataInscripcion {
    idInscripcion: number,
    idCliente: number,
    docCliente: string,
    fechaInicio: string,
    fechaFin: string,
    nomCliente: string,
    fotoCliente: string
}
async function insertInscripcion(ws: WebSocket, pubSub: PubSub, pubSubManager: PubSubManager) {
    logger.info(`insertInscripcion channel:${pubSub.channel} data: ${convertJson(pubSub)}`);
    const req = pubSub.message.req as IReq<Search>[];
    const res = pubSub.message.res as IRes<SearchResponse>[];
    const data = pubSub.message.data as IDataInscripcion;
    const auth = pubSub.message.auth as number;
    //const clientesData = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(data.idInscripcion), { type: QueryTypes.SELECT });
    const lectoresData = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT });

    const UserInfo: IUsuarioDevice = {
        UserInfo: {
            employeeNo: data.docCliente,
            name: data.nomCliente,
            userType: 'normal',
            Valid: {
                beginTime: moment(data.fechaInicio, "YYYY-MM-DDTHH:mm").utc().format(),
                endTime: moment(data.fechaFin, "YYYY-MM-DDTHH:mm").utc().format(),
                enable: true
            }
        }
    }
    //cargar datos
    const resultado: IRequest<IUsuarioDevice>[] = [];

    lectoresData.map((lector) => {
        const usuario: IRequest<IUsuarioDevice> = {
            ...lector,
            method: 'POST',
            endpoint: '/ISAPI/AccessControl/UserInfo/Record?format=json',
            data: UserInfo
        }
        resultado.push(usuario);
    });

    pubSub.message.req = resultado
    pubSub.message.res = []
    pubSub.message.data = data
    pubSub.message.auth = auth
    logger.info(`insertInscripcion salida  ${convertJson(pubSub)}`);
    pubSubManager.publish(ws, 'worker-1', pubSub.message);
}

async function insertFotoInscripcion(ws: WebSocket, pubSub: PubSub, pubSubManager: PubSubManager) {
    logger.info(`insertFotoInscripcion channel:${pubSub.channel} data: ${convertJson(pubSub)}`);
    const req = pubSub.message.req as IReq<Search>[];
    const res = pubSub.message.res as IRes<SearchResponse>[];
    const data = pubSub.message.data as IDataInscripcion;
    const auth = pubSub.message.auth as number;

    res.map(async (lector, i) => {
        if (lector.statusCode == 200) {
            logger.info(`insertFotoInscripcion Proceso de modificacion ${convertJson(req)}`);
            const updateInscripcion = await sequelize.query(updateIncripcionesQuery('si', data.idInscripcion), { type: QueryTypes.UPDATE });
            logger.info(`insertFotoInscripcion inscripcion modificado ${updateInscripcion[1]}`);
            //
            pubSub.message.data = data
            pubSub.message.auth = auth
            pubSub.message.event = 'insertInscripcion:show'
            initialNotificacion.text = 'Cliente sincronizado correctamente';
            initialNotificacion.bgColor = bgColor("success");
            pubSub.message.notificacion = initialNotificacion;
            pubSubManager.publish(ws, 'web', pubSub.message);
            //
            //const clientesFoto = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(data.idInscripcion), { type: QueryTypes.SELECT });
            const lectoresData = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT, raw: true });

            logger.info(`insertFotoInscripcion foto cliente ${convertJson(data)}`);

            const FaceDataRecord: IFaceDataRecord = {
                faceLibType: 'blackFD',
                faceURL: `${process.env.URL_WEB}/imagenes/clientes/${data.fotoCliente}`,
                FDID: '1',
                FPID: data.docCliente,
            }

            const resultado: IRequest<IFaceDataRecord>[] = [];

            lectoresData.map((lector) => {
                const foto: IRequest<IFaceDataRecord> = {
                    ...lector,
                    method: 'PUT',
                    endpoint: '/ISAPI/Intelligent/FDLib/FDSetUp?format=json',
                    data: FaceDataRecord
                }
                resultado.push(foto);
            });

            pubSub.message.req = resultado
            pubSub.message.res = []
            pubSub.message.data = data
            pubSub.message.auth = auth
            pubSub.message.event = 'insertFotoInscripcion:init'
            logger.info(`insertFotoInscripcion salida  ${convertJson(pubSub)}`);
            pubSubManager.publish(ws, 'worker-1', pubSub.message);
        } else {
            logger.error(`insertFotoInscripcion Registrar como error ${convertJson(pubSub.message)}`);
            pubSub.message.event = 'insertInscripcion:show'
            initialNotificacion.text = `Ocurrio un error en la sincronizacion`;
            initialNotificacion.bgColor = bgColor("error");
            pubSub.message.notificacion = initialNotificacion;
            pubSubManager.publish(ws, 'web', pubSub.message);
        }
    })
}

async function notificarFotoInscripcion(ws: WebSocket, pubSub: PubSub, pubSubManager: PubSubManager) {
    logger.info(`notificarFotoInscripcion channel:${pubSub.channel} data: ${convertJson(pubSub)}`);
    const data = pubSub.message.data as IDataInscripcion;
    const auth = pubSub.message.auth as number;

    pubSub.message.data = data
    pubSub.message.auth = auth
    pubSub.message.event = 'insertFoto:show'
    initialNotificacion.text = 'Foto sincronizado correctamente';
    initialNotificacion.bgColor = bgColor("success");
    pubSub.message.notificacion = initialNotificacion;
    pubSubManager.publish(ws, 'web', pubSub.message);
}
