import WebSocket from "ws";
import { pubSubManager } from "../config/patron";
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

export function insertIncripcion(ws: WebSocket, pubSub: PubSub) {
    switch (pubSub.message.event) {
        case 'insertInscripcion:init':
            insertInscripcion(ws, pubSub)
            break;
        case 'insertInscripcion:finalize':
            insertFotoInscripcion(ws, pubSub)
            break;
        case 'insertFotoInscripcion:finalize':
            notificarFotoInscripcion(ws, pubSub)
            break;
        case 'insertInscripcionNotificar:finalize':
            //confirmAutomaticoUsuario(ws, pubSub)
            break;
    }
}
interface IDataInscripcion {
    idInscripcion: number
}
async function insertInscripcion(ws: WebSocket, pubSub: PubSub) {
    logger.info(`insertInscripcion channel:${pubSub.channel} data: ${convertJson(pubSub)}`);
    const req = pubSub.message.req as IReq<Search>[];
    const res = pubSub.message.res as IRes<SearchResponse>[];
    const data = pubSub.message.data as IDataInscripcion;
    const clientesData = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(data.idInscripcion), { type: QueryTypes.SELECT });
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
    pubSub.message.data = clientesData[0]
    logger.info(`insertInscripcion salida  ${convertJson(pubSub)}`);
    pubSubManager.publish(ws, 'worker', pubSub.message);
}

async function insertFotoInscripcion(ws: WebSocket, pubSub: PubSub) {
    logger.info(`insertFotoInscripcion channel:${pubSub.channel} data: ${convertJson(pubSub)}`);
    const req = pubSub.message.req as IReq<Search>[];
    const res = pubSub.message.res as IRes<SearchResponse>[];
    const data = pubSub.message.data as IDataInscripcion;
    res.map(async (lector, i) => {
        if (lector.statusCode == 200) {
            logger.info(`insertFotoInscripcion Proceso de modificacion ${convertJson(req)}`);
            const updateInscripcion = await sequelize.query(updateIncripcionesQuery('si', data.idInscripcion), { type: QueryTypes.UPDATE });
            logger.info(`insertFotoInscripcion inscripcion modificado ${updateInscripcion[1]}`);
            //
            pubSub.message.event = 'insertInscripcion:show'
            initialNotificacion.text = 'Cliente sincronizado correctamente';
            initialNotificacion.bgColor = bgColor("success");
            pubSub.message.notificacion = initialNotificacion;
            pubSubManager.publish(ws, 'erpFrontEnd', pubSub.message);
            //
            const clientesFoto = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(data.idInscripcion), { type: QueryTypes.SELECT });
            const lectoresData = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT, raw: true });

            logger.info(`insertFotoInscripcion foto cliente ${convertJson(clientesFoto)}`);

            const FaceDataRecord: IFaceDataRecord = {
                faceLibType: 'blackFD',
                faceURL: `${process.env.URL_WEB}/imagenes/clientes/${clientesFoto[0].fotoCliente}`,
                FDID: '1',
                FPID: clientesFoto[0].idCliente.toString(),
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
            pubSub.message.data = data.idInscripcion
            pubSub.message.event = 'insertFotoInscripcion:init'
            logger.info(`insertFotoInscripcion salida  ${convertJson(pubSub)}`);
            pubSubManager.publish(ws, 'worker', pubSub.message);
        } else {
            logger.error(`insertFotoInscripcion Registrar como error ${convertJson(pubSub.message)}`);
            pubSub.message.event = 'insertInscripcion:show'
            initialNotificacion.text = `Ocurrio un error en la sincronizacion`;
            initialNotificacion.bgColor = bgColor("error");
            pubSub.message.notificacion = initialNotificacion;
            pubSubManager.publish(ws, 'erpFrontEnd', pubSub.message);
        }
    })
}

async function notificarFotoInscripcion(ws: WebSocket, pubSub: PubSub) {
    logger.info(`notificarFotoInscripcion channel:${pubSub.channel} data: ${convertJson(pubSub)}`);

    pubSub.message.event = 'insertFoto:show'
    initialNotificacion.text = 'Foto sincronizado correctamente';
    initialNotificacion.bgColor = bgColor("success");
    pubSub.message.notificacion = initialNotificacion;
    pubSubManager.publish(ws, 'erpFrontEnd', pubSub.message);
}
