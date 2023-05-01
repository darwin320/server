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
exports.ConfigDatabase = void 0;
const ts_results_1 = require("ts-results");
const config_1 = require("../models/config");
const database_1 = require("./database");
var ConfigDatabase;
(function (ConfigDatabase) {
    function getInvoiceGenerationDate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (0, ts_results_1.Ok)(yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const result = (_a = (yield prisma.config.findUnique({
                        where: {
                            key: config_1.DEFAULT_CONFIG.invoiceGenerationDay.key,
                        },
                    }))) !== null && _a !== void 0 ? _a : null;
                    if (result) {
                        return result;
                    }
                    else {
                        throw new Error();
                    }
                })));
            }
            catch (error) {
                return (0, ts_results_1.Err)(error);
            }
        });
    }
    ConfigDatabase.getInvoiceGenerationDate = getInvoiceGenerationDate;
    function updateInvoiceGenerationDate(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (0, ts_results_1.Ok)(yield (0, database_1.withPrismaClient)((prisma) => __awaiter(this, void 0, void 0, function* () {
                    return yield prisma.config.update({
                        where: {
                            key: config_1.DEFAULT_CONFIG.invoiceGenerationDay.key,
                        },
                        data: {
                            value: invoice.date.toString(),
                        },
                    });
                })));
            }
            catch (error) {
                return (0, ts_results_1.Err)(error);
            }
        });
    }
    ConfigDatabase.updateInvoiceGenerationDate = updateInvoiceGenerationDate;
})(ConfigDatabase = exports.ConfigDatabase || (exports.ConfigDatabase = {}));
