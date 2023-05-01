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
exports.ServicesApiEndpoint = void 0;
const audit_1 = require("../../audit/audit");
const serviceDatabase_1 = require("../../db/serviceDatabase");
const apiEndpoint_1 = require("../api/apiEndpoint");
const auth_1 = require("../auth");
class ServicesApiEndpoint extends apiEndpoint_1.ApiEndpoint {
    constructor() {
        super("services");
    }
    getElements(app) {
        app.get(this.getUrl(), auth_1.authorize, auth_1.authorizeOnRole, (_request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield serviceDatabase_1.ServiceDatabase.getServices();
            response.send(result);
        }));
    }
    getElementsType(app) {
        app.post(this.getUrlWithExtension("typeservices"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield serviceDatabase_1.ServiceDatabase.getTypeServices();
            response.send(result);
        }));
    }
    searchElements(app) {
        app.post(this.getUrlWithExtension("search"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const search = request.body.userSearch;
            const skip = request.body.skip;
            const take = request.body.take;
            const result = yield serviceDatabase_1.ServiceDatabase.searchService(search, skip, take);
            response.send(result);
        }));
    }
    getElementById(app) {
        app.get(this.getUrlWithExtension(":serviceId"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const serviceId = parseInt(request.params["serviceId"]);
            const result = yield serviceDatabase_1.ServiceDatabase.getServiceById(serviceId);
            response.send(result);
        }));
    }
    createElement(app) {
        app.post(this.getUrlWithExtension("create"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield serviceDatabase_1.ServiceDatabase.createService({
                nameService: request.body.nameService,
                typeService: request.body.typeService,
                nameSupplier: request.body.nameSupplier,
                company: request.body.company,
                phoneNumber: request.body.phoneNumber,
                description: request.body.description,
                price: request.body.price
            });
            response.send(result);
        }));
    }
    updateElement(app) {
        app.put(this.getUrlWithExtension("update/:serviceId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const serviceId = parseInt(request.params["serviceId"]);
            const changes = request.body;
            const result = yield serviceDatabase_1.ServiceDatabase.updateServiceById(serviceId, changes);
            response.send(result);
        }));
    }
    deleteElement(app) {
        app.delete(this.getUrlWithExtension("delete/:serviceId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const serviceId = parseInt(request.params["serviceId"]);
            const result = yield serviceDatabase_1.ServiceDatabase.deleteServiceById(serviceId);
            response.send(result);
        }));
    }
    registerCustomMethods(_app) { }
}
exports.ServicesApiEndpoint = ServicesApiEndpoint;
