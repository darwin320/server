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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationDatabase = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("./database");
var ReservationDatabase;
(function (ReservationDatabase) {
    function getReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.reservacion.findMany({
                    include: { inventario: true }
                });
            }));
        });
    }
    ReservationDatabase.getReservations = getReservations;
    function getTypeEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield Object.values(client_1.TypeEvent);
            }));
        });
    }
    ReservationDatabase.getTypeEvent = getTypeEvent;
    function getTypeSalon() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield Object.values(client_1.TypeSalon);
            }));
        });
    }
    ReservationDatabase.getTypeSalon = getTypeSalon;
    function getInventoryWithServices(idReservation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.inventory.findUnique({
                    where: {
                        reservacionId: idReservation,
                    },
                    include: { servicios: true },
                });
            }));
        });
    }
    ReservationDatabase.getInventoryWithServices = getInventoryWithServices;
    function searchReservation(search = "", skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                let whereQuery = null;
                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                nameClient: {
                                    contains: search,
                                },
                            },
                        ],
                    };
                }
                whereQuery = Object.assign(Object.assign({}, whereQuery), { state: true });
                const serviceCount = yield prisma.reservacion.count({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                });
                const reservacions = yield prisma.reservacion.findMany({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                    skip: skip !== null && skip !== void 0 ? skip : 0,
                    take: take !== null && take !== void 0 ? take : database_1.SEARCH_AMOUNT,
                });
                return {
                    search: reservacions,
                    searchCount: serviceCount,
                };
            }));
        });
    }
    ReservationDatabase.searchReservation = searchReservation;
    function deleteReservationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const reservation = yield prisma.reservacion.update({
                    where: {
                        id,
                    },
                    data: {
                        state: false,
                    },
                });
            }));
        });
    }
    ReservationDatabase.deleteReservationById = deleteReservationById;
    function createReservation(reservationInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = new client_1.PrismaClient();
            try {
                const reservation = yield prisma.reservacion.create({
                    data: {
                        idUser: reservationInformation.idUser,
                        nameClient: reservationInformation.nameClient,
                        salon: reservationInformation.salon,
                        cantidadAdultos: reservationInformation.cantidadAdultos,
                        cantidadNinos: reservationInformation.cantidadNinos,
                        fecha: reservationInformation.fecha,
                        fechaFin: reservationInformation.fechaFin,
                        horaInicio: reservationInformation.horaInicio,
                        horaFin: reservationInformation.horaFin,
                        tipoEvento: reservationInformation.tipoEvento,
                        downPayment: reservationInformation.downPayment,
                        priceRoomPerHour: reservationInformation.priceRoomPerHour,
                    },
                });
                const inventory = yield prisma.inventory.create({
                    data: {
                        reservacionId: reservation.id,
                    },
                });
                const serviceIds = [];
                for (const inv of reservationInformation.inventory) {
                    const service = yield prisma.service.create({
                        data: {
                            nameService: inv.nameService,
                            typeService: inv.typeService,
                            nameSupplier: inv.nameSupplier,
                            company: inv.company,
                            phoneNumber: inv.phoneNumber,
                            description: inv.description,
                            inventory: {
                                connect: {
                                    id: inventory.id,
                                },
                            },
                            price: Number(inv.price)
                        },
                    });
                    serviceIds.push({ id: service.id });
                }
                yield prisma.inventory.update({
                    where: { id: inventory.id },
                    data: { servicios: { connect: serviceIds } },
                });
                return reservation;
            }
            catch (error) {
                console.error(error);
                return null;
            }
            finally {
                yield prisma.$disconnect();
            }
        });
    }
    ReservationDatabase.createReservation = createReservation;
    function getReservationById(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const update = yield prisma.reservacion.findUnique({
                    where: {
                        id: reservationId,
                    },
                    include: {
                        inventario: {
                            include: { servicios: true }
                        }
                    },
                });
                return update;
            }));
        });
    }
    ReservationDatabase.getReservationById = getReservationById;
    function updateReservationById(id, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.reservacion.update({
                    where: {
                        id,
                    },
                    include: {
                        inventario: {
                            include: { servicios: true }
                        }
                    },
                    data: changes,
                });
            }));
        });
    }
    ReservationDatabase.updateReservationById = updateReservationById;
    function updateServices(services) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const updatedServices = [];
                for (const service of services) {
                    const updatedServiceData = Object.assign(Object.assign({}, service), { price: parseFloat(service.price) });
                    const updatedService = yield prisma.service.update({
                        where: {
                            id: service.id,
                        },
                        data: updatedServiceData,
                    });
                    updatedServices.push(updatedService);
                }
                return updatedServices;
            }));
        });
    }
    ReservationDatabase.updateServices = updateServices;
})(ReservationDatabase = exports.ReservationDatabase || (exports.ReservationDatabase = {}));
