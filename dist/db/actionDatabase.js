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
exports.ActionDatabase = void 0;
const database_1 = require("./database");
var ActionDatabase;
(function (ActionDatabase) {
    function getActions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.action.findMany();
            }));
        });
    }
    ActionDatabase.getActions = getActions;
    function updateActionById(id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.action.update({
                    where: {
                        id,
                    },
                    data: action,
                });
            }));
        });
    }
    ActionDatabase.updateActionById = updateActionById;
    function getActionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.action.findUnique({
                    where: {
                        id,
                    },
                });
            }));
        });
    }
    ActionDatabase.getActionById = getActionById;
    function createAction(actionInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.action.create({
                    data: actionInformation,
                });
            }));
        });
    }
    ActionDatabase.createAction = createAction;
    function searchAction(search = "", skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                let whereQuery = null;
                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                method: {
                                    contains: search,
                                },
                            },
                            {
                                url: {
                                    contains: search,
                                },
                            },
                            {
                                date: search,
                            },
                            {
                                userEmail: search,
                            },
                        ],
                    };
                }
                const actionCount = yield prisma.action.count({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                });
                const actions = yield prisma.action.findMany({
                    where: whereQuery !== null && whereQuery !== void 0 ? whereQuery : {},
                    skip: skip !== null && skip !== void 0 ? skip : 0,
                    take: take !== null && take !== void 0 ? take : database_1.SEARCH_AMOUNT,
                });
                return {
                    search: actions,
                    searchCount: actionCount,
                };
            }));
        });
    }
    ActionDatabase.searchAction = searchAction;
})(ActionDatabase = exports.ActionDatabase || (exports.ActionDatabase = {}));
