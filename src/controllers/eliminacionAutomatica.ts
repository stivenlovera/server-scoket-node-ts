import WebSocket from "ws";
import { pubSubManager } from "../config/patron";
import { convertJson } from "../utils/conversiones";
import { QueryTypes } from "sequelize";
import sequelize from "../config/database";
import { ILector, IReq, IRequest } from "../interface/database/lector";
import { obtenerTodoLectoresQuery } from "../querys/lectores";
import { Search, SearchResponse, UsuarioDelete } from "../interface/hikvision/dispositivo-facial/usuario";
import { IRes, PubSub, bgColor, initialNotificacion } from "../utils/validate";
import moment from "moment";
import { logger } from "..";

export function eliminacionAutomatica(ws: WebSocket, pubSub: PubSub) {
    switch (pubSub.message.event) {
        case 'deleteAutomatico:init':
            obtenerTodoUsuario(ws, pubSub)
            break;
        case 'deleteAutomatico:finalize':
            deleteAutomaticoUsuario(ws, pubSub)
            break;
        case 'delete:finalize':
            confirmAutomaticoUsuario(ws, pubSub)
            break;
    }
}

async function obtenerTodoUsuario(ws: WebSocket, pubSub: PubSub) {
    logger.info(`obtenerTodoUsuario channel:${pubSub.channel} event: ${convertJson(pubSub.message.event)}`);
    const lectoresData = await sequelize.query<ILector>(obtenerTodoLectoresQuery(), { type: QueryTypes.SELECT });
    const UserInfo: Search = {
        UserInfoSearchCond: {
            searchID: '1',
            maxResults: 10000,
            searchResultPosition: 0
        }
    }
    const data: IRequest<Search>[] = [];
    lectoresData.map((lector) => {
        const usuario: IRequest<Search> = {
            ...lector,
            method: 'POST',
            endpoint: '/ISAPI/AccessControl/UserInfo/Search?format=json',
            data: UserInfo
        }
        data.push(usuario);
    });

    pubSub.message.req = data
    logger.info(`obtenerTodoUsuario salida  ${convertJson(pubSub)}`);
    pubSubManager.publish(ws, 'worker', pubSub.message);
}

async function deleteAutomaticoUsuario(ws: WebSocket, pubSub: PubSub) {
    logger.info(`deleteAutomaticoUsuario channel:${pubSub.channel} event: ${convertJson(pubSub.message.event)}`);
    const req = pubSub.message.req as IReq<Search>[];
    const res = pubSub.message.res as IRes<SearchResponse>[];
    logger.info(` req => ${convertJson(req)}`);
    logger.info(` res => ${convertJson(res)}`);

    const eliminarUsuario: UsuarioDelete[] = []
    res.map((lector, i) => {
        //instacia para eliminar
        const eliminar: UsuarioDelete = {
            UserInfoDelCond: {
                EmployeeNoList: []
            }
        }
        lector.data.UserInfoSearch.UserInfo.map((cliente) => {
            logger.info(`lector ${req[i].ipLector} => ${convertJson(cliente.Valid)}`);
            const fechaActual = moment();
            const fechaDispositivo = moment(cliente.Valid?.endTime);
            if (fechaActual > fechaDispositivo) {
                logger.info(`fechaDispositivo es mayor ${convertJson(fechaDispositivo)}`);
                //objecto a eliminar
                eliminar.UserInfoDelCond.EmployeeNoList.push({
                    employeeNo: cliente.employeeNo
                })
            }
        });
        eliminarUsuario.push(eliminar);
    });
    // enviar eliminar a los lectores  que se optuvo en las solicitudes

    const data: IRequest<UsuarioDelete>[] = [];
    req.map((lector, i) => {
        if (eliminarUsuario[i].UserInfoDelCond.EmployeeNoList.length > 0) {
            const request: IRequest<UsuarioDelete> = {
                ...lector,
                method: 'PUT',
                endpoint: '/ISAPI/AccessControl/UserInfo/Delete?format=json',
                data: eliminarUsuario[i]
            }
            data.push(request);
        }
    });

    pubSub.message.event = 'delete:init'
    pubSub.message.req = data
    pubSub.message.res = []
    logger.info(`usuarios a eliminar ${convertJson(pubSub)}`);
    pubSubManager.publish(ws, 'worker', pubSub.message);
}

async function confirmAutomaticoUsuario(ws: WebSocket, pubSub: PubSub) {

    pubSub.message.event = 'delete:show'
    initialNotificacion.text = 'Se limpio dispositivos correctamente';
    initialNotificacion.bgColor = bgColor("success");
    pubSub.message.notificacion=initialNotificacion;
    pubSubManager.publish(ws, 'erpFrontEnd', pubSub.message);
}
