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
exports.ApiDatabase = void 0;
const role_1 = require("../models/role");
const database_1 = require("./database");
var ApiDatabase;
(function (ApiDatabase) {
    function updateApisOnRoles(changes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                // If it's the super user, don't update
                if (changes.roleId === role_1.DEFAULT_ROLES.superAdmin.id) {
                    return;
                }
                return yield prisma.apisOnRoles.update({
                    where: {
                        apiId_roleId: {
                            apiId: changes.apiId,
                            roleId: changes.roleId,
                        },
                    },
                    data: {
                        get: changes.get,
                        post: changes.post,
                        delete: changes.delete,
                    },
                });
            }));
        });
    }
    ApiDatabase.updateApisOnRoles = updateApisOnRoles;
    function getApi(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const api = yield prisma.api.findUnique({
                    where: {
                        name,
                    },
                });
                return api !== null && api !== void 0 ? api : null;
            }));
        });
    }
    ApiDatabase.getApi = getApi;
    function getApis() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const apis = yield prisma.api.findMany();
                return apis;
            }));
        });
    }
    ApiDatabase.getApis = getApis;
    function createApisOnRoles(apiId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const apisOnRoles = yield prisma.apisOnRoles.create({
                    data: {
                        apiId,
                        roleId,
                    },
                });
                return apisOnRoles !== null && apisOnRoles !== void 0 ? apisOnRoles : null;
            }));
        });
    }
    ApiDatabase.createApisOnRoles = createApisOnRoles;
    function getApisOnRolesByRoleId(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const apisOnRoles = yield prisma.apisOnRoles.findMany({
                    where: {
                        roleId,
                    },
                    include: {
                        api: true,
                    },
                });
                return apisOnRoles;
            }));
        });
    }
    ApiDatabase.getApisOnRolesByRoleId = getApisOnRolesByRoleId;
    function getApisOnRolesById(apiId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const apisOnRoles = yield prisma.apisOnRoles.findUnique({
                    where: {
                        apiId_roleId: {
                            apiId: apiId,
                            roleId: roleId,
                        },
                    },
                });
                return apisOnRoles !== null && apisOnRoles !== void 0 ? apisOnRoles : null;
            }));
        });
    }
    ApiDatabase.getApisOnRolesById = getApisOnRolesById;
})(ApiDatabase = exports.ApiDatabase || (exports.ApiDatabase = {}));
