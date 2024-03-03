"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeUsuario = exports.routeDispositivo = void 0;
const DeviceController_1 = require("../controllers/DeviceController");
const routeDispositivo = (route) => {
    route.post(`/`, DeviceController_1.deviceController.index);
    return route;
};
exports.routeDispositivo = routeDispositivo;
const routeUsuario = (route) => {
    route.get(`/usuario`, DeviceController_1.deviceController.index);
    return route;
};
exports.routeUsuario = routeUsuario;
