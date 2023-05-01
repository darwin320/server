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
exports.UserDatabase = void 0;
const bcrypt_1 = require("bcrypt");
const ts_results_1 = require("ts-results");
const errors_1 = require("../models/errors/errors");
const role_1 = require("../models/role");
const database_1 = require("./database");
var UserDatabase;
(function (UserDatabase) {
    function getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                const user = yield prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                return user !== null && user !== void 0 ? user : null;
            }));
        });
    }
    UserDatabase.getUserByEmail = getUserByEmail;
    function getUserById(id, withRole = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.user.findUnique({
                    where: {
                        id,
                    },
                    include: {
                        role: withRole,
                    },
                });
            }));
        });
    }
    UserDatabase.getUserById = getUserById;
    function createUser(userInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = yield prisma.user.create({
                        data: {
                            firstName: userInformation.firstName,
                            lastName: userInformation.lastName,
                            email: userInformation.email,
                            password: (0, bcrypt_1.hashSync)(userInformation.password, (0, bcrypt_1.genSaltSync)(10)),
                            roleId: userInformation.role.id,
                        },
                    });
                    return (0, ts_results_1.Ok)(user);
                }
                catch (error) {
                    return (0, ts_results_1.Err)(errors_1.Errors.getErrorFromCode(error.code));
                }
            }));
        });
    }
    UserDatabase.createUser = createUser;
    function deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (id === role_1.DEFAULT_ROLES.superAdmin.id) {
                        if (!(yield platformHasMoreThanOneSuperUser(prisma))) {
                            return (0, ts_results_1.Err)(errors_1.Errors.getErrorFromCode("LSUE"));
                        }
                    }
                    const deletedUser = yield prisma.user.delete({
                        where: {
                            id,
                        },
                    });
                    return (0, ts_results_1.Ok)(deletedUser);
                }
                catch (error) {
                    return (0, ts_results_1.Err)(errors_1.Errors.getErrorFromCode(error.code));
                }
            }));
        });
    }
    UserDatabase.deleteUser = deleteUser;
    function updateUser(userToChangeId, userChanges) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                if (yield canUpdateUser(prisma, userToChangeId, userChanges)) {
                    try {
                        const updatedUser = yield prisma.user.update({
                            where: {
                                id: userToChangeId,
                            },
                            data: {
                                firstName: userChanges.firstName,
                                lastName: userChanges.lastName,
                                email: userChanges.email,
                                roleId: userChanges.role.id,
                            },
                        });
                        return (0, ts_results_1.Ok)(updatedUser);
                    }
                    catch (error) {
                        return (0, ts_results_1.Err)(errors_1.Errors.getErrorFromCode(error.code));
                    }
                }
                else {
                    return (0, ts_results_1.Err)(errors_1.Errors.getErrorFromCode("LSUE"));
                }
            }));
        });
    }
    UserDatabase.updateUser = updateUser;
    function searchUser(search = "", skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                let whereQuery = null;
                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                firstName: {
                                    contains: search,
                                },
                            },
                            {
                                lastName: {
                                    contains: search,
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                },
                            },
                        ],
                    };
                }
                const userCount = yield prisma.user.count({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                });
                const users = yield prisma.user.findMany({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                    include: {
                        role: true,
                    },
                    skip: skip !== null && skip !== void 0 ? skip : 0,
                    take: take !== null && take !== void 0 ? take : database_1.SEARCH_AMOUNT,
                });
                return {
                    search: users,
                    searchCount: userCount,
                };
            }));
        });
    }
    UserDatabase.searchUser = searchUser;
    /**
     * Checks if there is more than 1 super user when deleting or updating an user
     * if it is the last super user, the role can't be changed or removed.
     */
    function canUpdateUser(prisma, userToChangeId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToChange = yield prisma.user.findUnique({
                where: {
                    id: userToChangeId,
                },
            });
            // If the user that we are trying to change is a Super Admin we have to
            // check:
            //
            // 1. If the user wants to change the role, check if there is more than
            // one super user.
            if ((userToChange === null || userToChange === void 0 ? void 0 : userToChange.roleId) === role_1.DEFAULT_ROLES.superAdmin.id) {
                // This means the user is changing the role of the user
                if (changes.role.id !== role_1.DEFAULT_ROLES.superAdmin.id) {
                    return platformHasMoreThanOneSuperUser(prisma);
                }
            }
            return true;
        });
    }
    function platformHasMoreThanOneSuperUser(prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            const superUsers = yield prisma.user.findMany({
                where: {
                    roleId: role_1.DEFAULT_ROLES.superAdmin.id,
                },
            });
            return superUsers.length > 1;
        });
    }
})(UserDatabase = exports.UserDatabase || (exports.UserDatabase = {}));
