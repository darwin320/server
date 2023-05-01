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
exports.ServiceDatabase = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("./database");
var ServiceDatabase;
(function (ServiceDatabase) {
    function createService(serviceInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const service = yield prisma.service.create({
                    data: {
                        nameService: serviceInformation.nameService,
                        typeService: serviceInformation.typeService,
                        nameSupplier: serviceInformation.nameSupplier,
                        company: serviceInformation.company,
                        phoneNumber: serviceInformation.phoneNumber,
                        description: serviceInformation.description,
                        price: serviceInformation.price
                    },
                });
                return service !== null && service !== void 0 ? service : null;
            }));
        });
    }
    ServiceDatabase.createService = createService;
    function getTypeServices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield Object.values(client_1.TypeService);
            }));
        });
    }
    ServiceDatabase.getTypeServices = getTypeServices;
    function getServices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const xd = yield prisma.service.findMany({
                    where: {
                        inventory: {
                            none: {},
                        },
                    },
                });
                return xd;
            }));
        });
    }
    ServiceDatabase.getServices = getServices;
    function getServiceById(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.service.findUnique({
                    where: {
                        id: serviceId,
                    },
                });
            }));
        });
    }
    ServiceDatabase.getServiceById = getServiceById;
    function deleteServiceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.service.delete({
                    where: {
                        id,
                    },
                });
            }));
        });
    }
    ServiceDatabase.deleteServiceById = deleteServiceById;
    function updateServiceById(id, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.service.update({
                    where: {
                        id,
                    },
                    data: changes,
                });
            }));
        });
    }
    ServiceDatabase.updateServiceById = updateServiceById;
    function searchService(search = "", skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                let whereQuery = null;
                // Obtener todos los ids de los servicios que tienen al menos un inventario asociado
                const servicesWithInventory = yield prisma.service.findMany({
                    where: {
                        inventory: {
                            some: {}
                        }
                    },
                    select: {
                        id: true
                    }
                });
                const serviceIdsWithInventory = servicesWithInventory.map((service) => service.id);
                if (search.length > 0) {
                    whereQuery = {
                        NOT: {
                            id: {
                                in: serviceIdsWithInventory
                            },
                            nameService: {
                                contains: search,
                            },
                        },
                    };
                }
                else {
                    whereQuery = {
                        NOT: {
                            id: {
                                in: serviceIdsWithInventory
                            }
                        }
                    };
                }
                const serviceCount = yield prisma.service.count({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                });
                const services = yield prisma.service.findMany({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                    skip: skip !== null && skip !== void 0 ? skip : 0,
                    take: take !== null && take !== void 0 ? take : database_1.SEARCH_AMOUNT,
                });
                return {
                    search: services,
                    searchCount: serviceCount,
                };
            }));
        });
    }
    ServiceDatabase.searchService = searchService;
})(ServiceDatabase = exports.ServiceDatabase || (exports.ServiceDatabase = {}));
