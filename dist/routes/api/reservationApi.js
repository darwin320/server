"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationApiEndpoint = void 0;
const audit_1 = require("../../audit/audit");
const reservationDatabase_1 = require("../../db/reservationDatabase");
const apiEndpoint_1 = require("../api/apiEndpoint");
const auth_1 = require("../auth");
const client_1 = require("@prisma/client");
class ReservationApiEndpoint extends apiEndpoint_1.ApiEndpoint {
    constructor() {
        super("reservations");
    }
    getElements(app) {
        app.get(this.getUrl(), auth_1.authorize, auth_1.authorizeOnRole, (_request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield reservationDatabase_1.ReservationDatabase.getReservations();
            response.send(result);
        }));
    }
    getElementsType(app) {
        //throw new Error("Method not implemented.");
        app.post(this.getUrlWithExtension("typeSalon"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield reservationDatabase_1.ReservationDatabase.getTypeSalon();
            response.send(result);
        }));
    }
    searchElements(app) {
        //throw new Error("Method not implemented.");
        app.post(this.getUrlWithExtension("search"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const search = request.body.userSearch;
            const skip = request.body.skip;
            const take = request.body.take;
            const result = yield reservationDatabase_1.ReservationDatabase.searchReservation(search, skip, take);
            response.send(result);
        }));
    }
    getElementById(app) {
        //throw new Error("Method not implemented.");
        app.get(this.getUrlWithExtension(":reservationId"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const reservationId = parseInt(request.params["reservationId"]);
            const result = yield reservationDatabase_1.ReservationDatabase.getReservationById(reservationId);
            response.send(result);
        }));
    }
    createElement(app) {
        app.post(this.getUrlWithExtension("create"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield reservationDatabase_1.ReservationDatabase.createReservation({
                idUser: request.body.idUser,
                nameClient: request.body.nameClient,
                salon: request.body.salon,
                cantidadAdultos: request.body.cantidadAdultos,
                cantidadNinos: request.body.cantidadNinos,
                fecha: request.body.fecha,
                fechaFin: request.body.fechaFin,
                horaInicio: request.body.horaInicio,
                horaFin: request.body.horaFin,
                tipoEvento: request.body.tipoEvento,
                downPayment: request.body.downPayment,
                priceRoomPerHour: request.body.priceRoomPerHour,
                inventory: request.body.inventory
            });
            response.send(result);
        }));
        // throw new Error("Method not implemented.");
    }
    updateElement(app) {
        app.put(this.getUrlWithExtension("update/:reservationId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const reservationId = parseInt(request.params["reservationId"]);
            const _a = request.body, { id, inventario } = _a, changes = __rest(_a, ["id", "inventario"]);
            const result = yield reservationDatabase_1.ReservationDatabase.updateReservationById(reservationId, changes);
            if (inventario && inventario.servicios) {
                const updatedServices = yield reservationDatabase_1.ReservationDatabase.updateServices(inventario.servicios);
                // Aquí puedes decidir cómo combinar 'result' y 'updatedServices' si es necesario.
                // Por ejemplo, podrías agregar 'updatedServices' al objeto 'inventario' en 'result'.
                const prisma = new client_1.PrismaClient();
                const serviceIds = [];
                for (const inv of inventario.servicios) {
                    const service = yield prisma.service.update({
                        where: { id: inv.id },
                        data: {
                            nameService: inv.nameService,
                            typeService: inv.typeService,
                            nameSupplier: inv.nameSupplier,
                            company: inv.company,
                            phoneNumber: inv.phoneNumber,
                            description: inv.description,
                            inventory: {
                                connect: {
                                    id: inventario.id,
                                },
                            },
                            price: Number(inv.price)
                        },
                    });
                    serviceIds.push({ id: service.id });
                }
                yield prisma.inventory.update({
                    where: { id: inventario.id },
                    data: { servicios: { connect: serviceIds } },
                });
            }
            response.send(result);
        }));
        //throw new Error("Method not implemented.");
    }
    deleteElement(app) {
        app.delete(this.getUrlWithExtension("delete/:ReservationId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const reservationId = parseInt(request.params["ReservationId"]);
            const result = yield reservationDatabase_1.ReservationDatabase.deleteReservationById(reservationId);
            response.send(result);
        }));
        //throw new Error("Method not implemented.");
    }
    registerCustomMethods(app) {
        // throw new Error("Method not implemented.");
        app.post(this.getUrlWithExtension("typeEvent"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield reservationDatabase_1.ReservationDatabase.getTypeEvent();
            response.send(result);
        }));
    }
}
exports.ReservationApiEndpoint = ReservationApiEndpoint;
