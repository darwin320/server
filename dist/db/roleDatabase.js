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
exports.RoleDatabase = void 0;
const role_1 = require("../models/role");
const database_1 = require("./database");
var RoleDatabase;
(function (RoleDatabase) {
    function updateRoleById(id, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                if (yield canUpdateRole(id)) {
                    return yield prisma.role.update({
                        where: {
                            id,
                        },
                        data: changes,
                    });
                }
                else {
                    throw new Error("Can't update role!");
                }
            }));
        });
    }
    RoleDatabase.updateRoleById = updateRoleById;
    function deleteRoleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                if (yield canDeleteRole(prisma, id)) {
                    return yield prisma.role.delete({
                        where: {
                            id,
                        },
                    });
                }
                else {
                    throw new Error("Can't delete role!");
                }
            }));
        });
    }
    RoleDatabase.deleteRoleById = deleteRoleById;
    function getRoleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const role = yield prisma.role.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        apisOnRoles: {
                            include: {
                                api: true,
                            },
                        },
                    },
                });
                return role !== null && role !== void 0 ? role : null;
            }));
        });
    }
    RoleDatabase.getRoleById = getRoleById;
    function getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const roles = yield prisma.role.findMany();
                return roles;
            }));
        });
    }
    RoleDatabase.getRoles = getRoles;
    function createRole(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const role = yield prisma.role.create({
                    data: {
                        name,
                    },
                });
                return role !== null && role !== void 0 ? role : null;
            }));
        });
    }
    RoleDatabase.createRole = createRole;
    function searchRole(search = "", skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                let whereQuery = null;
                if (search.length > 0) {
                    whereQuery = {
                        name: {
                            contains: search,
                        },
                    };
                }
                const roleCount = yield prisma.role.count({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                });
                const roles = yield prisma.role.findMany({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                    skip: skip !== null && skip !== void 0 ? skip : 0,
                    take: take !== null && take !== void 0 ? take : database_1.SEARCH_AMOUNT,
                });
                return {
                    search: roles,
                    searchCount: roleCount,
                };
            }));
        });
    }
    RoleDatabase.searchRole = searchRole;
})(RoleDatabase = exports.RoleDatabase || (exports.RoleDatabase = {}));
function canDeleteRole(prisma, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id === role_1.DEFAULT_ROLES.superAdmin.id) {
            return false;
        }
        const users = yield prisma.user.findMany({
            where: {
                roleId: id,
            },
        });
        // This means that if there is an user with this role, we can't delete the
        // role.
        return users.length === 0;
    });
}
function canUpdateRole(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return id !== role_1.DEFAULT_ROLES.superAdmin.id;
    });
}
