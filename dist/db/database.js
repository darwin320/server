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
exports.withPrismaClient = exports.SEARCH_AMOUNT = void 0;
const client_1 = require("@prisma/client");
const prisma = global.prisma || new client_1.PrismaClient();
// This constant will determine the amount of searches made in the database. This
// should be used for every API where you want to make a search, so by default
// we will search SEARCH_AMOUNT elements in the database at max.
//
// This is only a recomended amount, you can use the value you want, if the API
// needs a bigger or lower default.
exports.SEARCH_AMOUNT = 30;
function withPrismaClient(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.$connect();
        const result = yield callback(prisma);
        yield prisma.$disconnect();
        //console.log("finalapi:" + result);
        return result;
    });
}
exports.withPrismaClient = withPrismaClient;
