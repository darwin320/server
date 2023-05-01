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
exports.ActionsApiEndpoint = void 0;
const audit_1 = require("../../audit/audit");
const actionDatabase_1 = require("../../db/actionDatabase");
const apiEndpoint_1 = require("../api/apiEndpoint");
const auth_1 = require("../auth");
class ActionsApiEndpoint extends apiEndpoint_1.ApiEndpoint {
    getElementsType(app) {
        //throw new Error("Method not implemented.");
    }
    constructor() {
        super("actions");
    }
    searchElements(app) {
        app.post(this.getUrlWithExtension("search"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const search = request.body.userSearch;
            const skip = request.body.skip;
            const take = request.body.take;
            const result = yield actionDatabase_1.ActionDatabase.searchAction(search, skip, take);
            response.send(result);
        }));
    }
    getElementById(app) {
        app.get(this.getUrlWithExtension(":actionId"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const actionId = parseInt(request.params["actionId"]);
            const changes = request.body;
            const result = yield actionDatabase_1.ActionDatabase.updateActionById(actionId, changes);
            response.send(result);
        }));
    }
    createElement(app) {
        app.post(this.getUrlWithExtension(":actionId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const actionInformation = request.body;
            const result = yield actionDatabase_1.ActionDatabase.createAction(actionInformation);
            response.send(result);
        }));
    }
    updateElement(app) {
        app.post(this.getUrlWithExtension(":actionId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const actionInformation = request.body;
            const result = yield actionDatabase_1.ActionDatabase.createAction(actionInformation);
            response.send(result);
        }));
    }
    getElements(app) {
        app.get(this.getUrl(), auth_1.authorize, auth_1.authorizeOnRole, (_request, response) => __awaiter(this, void 0, void 0, function* () {
            const actions = yield actionDatabase_1.ActionDatabase.getActions();
            response.send(actions);
        }));
    }
    deleteElement(app) {
        app.delete((_request, response) => {
            response.sendStatus(403);
        });
    }
    registerCustomMethods(_app) { }
}
exports.ActionsApiEndpoint = ActionsApiEndpoint;
