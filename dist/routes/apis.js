"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApiModule = exports.REGISTERED_APIS = void 0;
const rolesApi_1 = require("../routes/api/rolesApi");
const usersApi_1 = require("../routes/api/usersApi");
const servicesApi_1 = require("./api/servicesApi");
const reservationApi_1 = require("./api/reservationApi");
exports.REGISTERED_APIS = [
    new rolesApi_1.RolesApiEndpoint(),
    new usersApi_1.UsersApiEndpoint(),
    new servicesApi_1.ServicesApiEndpoint(),
    new reservationApi_1.ReservationApiEndpoint()
];
//CONFIGURA MODULIS
function configureApiModule(app) {
    for (const api of exports.REGISTERED_APIS) {
        api.registerMethods(app);
    }
}
exports.configureApiModule = configureApiModule;
