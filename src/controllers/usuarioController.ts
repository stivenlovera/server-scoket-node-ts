import WebSocket from "ws"
import { EmitAll, IMessageSocket, logger } from "..";
import sequelize from "../config/database";
import { IIncripcionQuery } from "../interface/database/inscripcion";
import { obtenerIncripcionesQuery, updateIncripcionesQuery } from "../querys/inscripcion";
import { QueryTypes } from "sequelize";
import { ILector, IRequest } from "../interface/database/lector";
import { obtenerTodoLectoresQuery } from "../querys/lectores";
import { IUserInfo, IUsuarioDevice, IUsuarioDeviceDestroy } from "../interface/hikvision/dispositivo-facial/usuario";
import moment from "moment";
import { convertJson } from "../utils/conversiones";
import { IResponse, IResponseError, validateErrorStatus } from "../utils/validate";
import { IFaceDataRecord } from "../interface/hikvision/dispositivo-facial/foto";


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
                case 'update:init':
                    await edit(data);
                    break;
                case 'update:finalize':
                    await update(data);
                    break;
                case 'destroy:init':
                    await destroy(data);
                    break;
                case 'destroy:finalize':
                    console.log('despues de destruir', data)
                    //await destroy(data);

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
    });

    const response: IMessageSocket<IRequest<IUsuarioDevice>[]> = {
        data: data,
        channel: 'server',
        event: message.event,
        type: message.type,
        adjuntos: clientesData[0]
    }
    EmitAll(response)
}

export interface IStore {
    statusCode: number
    StatusDescription: string
    subStatusCode: string
}
async function store(message: IMessageSocket<IResponse[]>) {
    logger.info(`usuarioController/store ${convertJson(message.type)}`);
    message.data.map(async (lector) => {
        if (lector.StatusCode == 200) {
            const req = lector.Request as IRequest<IUsuarioDevice>;
            const adjunto = message.adjuntos as IIncripcionQuery;
            const res = lector.Response as IStore;

            logger.info(`usuarioController/store Proceso de modificacion ${convertJson(req)}`);
            const updateInscripcion = await sequelize.query(updateIncripcionesQuery('si', parseInt(req.data.UserInfo.employeeNo)), { type: QueryTypes.UPDATE });
            logger.info(`usuarioController/store inscripcion modificado ${updateInscripcion[1]}`);

            const clientesFoto = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(adjunto.idInscripcion), { type: QueryTypes.SELECT });
            const lectoresData = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT,raw: true });
            // convertir a object 


            logger.info(`usuarioController/store foto cliente ${convertJson(clientesFoto)}`);

            const FaceDataRecord: IFaceDataRecord = {
                faceLibType: 'blackFD',
                faceURL: `${process.env.URL_WEB}/imagenes/clientes/${clientesFoto[0].fotoCliente}`,
                FDID: '1',
                FPID: clientesFoto[0].idCliente.toString(),
            }

            const data: IRequest<IFaceDataRecord>[] = [];

            lectoresData.map((lector) => {
                const foto: IRequest<IFaceDataRecord> = {
                    ...lector,
                    method: 'PUT',
                    endpoint: '/ISAPI/Intelligent/FDLib/FDSetUp?format=json',
                    data: FaceDataRecord
                }
                data.push(foto);
            });
            const response: IMessageSocket<IRequest<IFaceDataRecord>[]> = {
                data: data,
                channel: 'server',
                event: 'foto',
                type: 'store:init',
                adjuntos: clientesFoto[0]
            }
            EmitAll(response);
        } else {
            logger.info(`usuarioController/store Registrar como error ${convertJson(lector.StatusDescription)}`);
        }
    })
}

async function edit(message: IMessageSocket<IReqCreate>) {
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
    //cargar datos
    const data: IRequest<IUsuarioDevice>[] = [];

    lectoresData.map((lector) => {
        const usuario: IRequest<IUsuarioDevice> = {
            ...lector,
            method: 'PUT',
            endpoint: '/ISAPI/AccessControl/UserInfo/Record?format=json',
            data: UserInfo
        }
        data.push(usuario);
    });

    const response: IMessageSocket<IRequest<IUsuarioDevice>[]> = {
        data: data,
        channel: 'server',
        event: message.event,
        type: message.type,
        adjuntos: clientesData[0]
    }
    EmitAll(response)
}


interface IReqDestroy {
    idInscripcion: number
}
async function destroy(message: IMessageSocket<IReqDestroy>) {
    const clientesData = await sequelize.query<IIncripcionQuery>(obtenerIncripcionesQuery(message.data.idInscripcion), { type: QueryTypes.SELECT });
    const lectoresData = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT });

    const usuarioDeviceDestroy: IUsuarioDeviceDestroy = {
        UserInfoDelCond: {
            EmployeeNoList: [
                {
                    employeeNo: clientesData[0].idCliente.toString()
                }
            ]
        }
    }
    //cargar datos
    const data: IRequest<IUsuarioDeviceDestroy>[] = [];

    lectoresData.map((lector) => {
        const usuario: IRequest<IUsuarioDeviceDestroy> = {
            ...lector,
            method: 'PUT',
            endpoint: '/ISAPI/AccessControl/UserInfo/Delete?format=json',
            data: usuarioDeviceDestroy
        }
        data.push(usuario);
    });

    const response: IMessageSocket<IRequest<IUsuarioDeviceDestroy>[]> = {
        data: data,
        channel: 'server',
        event: message.event,
        type: message.type,
        adjuntos: clientesData[0]
    }
    EmitAll(response)
}

export interface IStore {
    statusCode: number
    StatusDescription: string
    subStatusCode: string
}
async function update(message: IMessageSocket<IResponse[]>) {
    console.log('recibir editado ',message)
}