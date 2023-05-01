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
exports.ConfigApiEndpoint = void 0;
const ts_results_1 = require("ts-results");
const audit_1 = require("../../audit/audit");
const cron_1 = require("../../cron/cron");
const configDatabase_1 = require("../../db/configDatabase");
const apiEndpoint_1 = require("../api/apiEndpoint");
const auth_1 = require("../auth");
class ConfigApiEndpoint extends apiEndpoint_1.ApiEndpoint {
    getElementsType(app) {
        // throw new Error("Method not implemented.");
    }
    constructor() {
        super("config");
    }
    getElements(app) { }
    searchElements(app) { }
    getElementById(app) { }
    createElement(app) { }
    updateElement(app) { }
    deleteElement(app) { }
    registerCustomMethods(app) {
        app.get(this.getUrlWithExtension("getInvoiceGenerationDate"), auth_1.authorize, auth_1.authorizeOnRole, (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const date = yield configDatabase_1.ConfigDatabase.getInvoiceGenerationDate();
            if (date.ok) {
                response.locals.result = (0, ts_results_1.Ok)(new Date(date.val.value));
            }
            else {
                response.locals.result = date.err;
            }
            next();
        }), this.sendObjectResponse);
        app.patch(this.getUrlWithExtension("updateInvoiceGenerationDate"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const invoiceConfigDto = request.body;
            response.locals.result =
                yield configDatabase_1.ConfigDatabase.updateInvoiceGenerationDate(invoiceConfigDto);
            if (response.locals.result.ok) {
                cron_1.CronJobManager.getInstance().resetInvoiceGenerationDateJob();
            }
            next();
        }), this.sendObjectResponse);
    }
}
exports.ConfigApiEndpoint = ConfigApiEndpoint;
