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
exports.RolesApiEndpoint = void 0;
const ts_results_1 = require("ts-results");
const audit_1 = require("../../audit/audit");
const apiDatabase_1 = require("../../db/apiDatabase");
const roleDatabase_1 = require("../../db/roleDatabase");
const apiEndpoint_1 = require("../api/apiEndpoint");
const auth_1 = require("../auth");
class RolesApiEndpoint extends apiEndpoint_1.ApiEndpoint {
    getElementsType(app) {
        //throw new Error("Method not implemented.");
    }
    constructor() {
        super("roles");
    }
    getElements(app) {
        app.get(this.getUrl(), auth_1.authorize, auth_1.authorizeOnRole, (_, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield roleDatabase_1.RoleDatabase.getRoles();
            response.send(result);
        }));
    }
    searchElements(app) {
        app.post(this.getUrlWithExtension("search"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const search = request.body.userSearch;
            const skip = request.body.skip;
            const take = request.body.take;
            const result = yield roleDatabase_1.RoleDatabase.searchRole(search, skip, take);
            response.send(result);
        }));
    }
    getElementById(app) {
        app.get(this.getUrlWithExtension(":roleId"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const roleId = parseInt(request.params["roleId"]);
            const result = yield roleDatabase_1.RoleDatabase.getRoleById(roleId);
            response.send(result);
        }));
    }
    createElement(app) {
        app.post(this.getUrlWithExtension("create"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield roleDatabase_1.RoleDatabase.createRole(request.body.roleName);
            const apis = yield apiDatabase_1.ApiDatabase.getApis();
            // This right here might be problematic in the future, as we are
            // creating the role and generating all the relationships with
            // the APIs, so if we have many roles or many APIs, this can be
            // troublesome. For now this I think is the correct way, as we
            // can have a lot of control over the permissions, but we have
            // to see later.
            for (const api of apis) {
                yield apiDatabase_1.ApiDatabase.createApisOnRoles(api.id, result.id);
            }
            response.sendStatus(200);
        }));
    }
    updateElement(app) {
        app.put(this.getUrlWithExtension("update/:roleId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const roleId = parseInt(request.params["roleId"]);
            const changes = request.body;
            const result = yield roleDatabase_1.RoleDatabase.updateRoleById(roleId, changes);
            response.send(result);
        }));
    }
    deleteElement(app) {
        app.delete(this.getUrlWithExtension("delete/:roleId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const roleId = parseInt(request.params["roleId"]);
            const result = yield roleDatabase_1.RoleDatabase.deleteRoleById(roleId);
            response.send(result);
        }));
    }
    registerCustomMethods(app) {
        app.put(this.getUrlWithExtension("update-apis-on-roles"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const changes = request.body;
            for (const change of changes) {
                yield apiDatabase_1.ApiDatabase.updateApisOnRoles(change);
            }
            response.locals.result = (0, ts_results_1.Ok)(true);
            next();
        }), this.sendOkResponse);
    }
}
exports.RolesApiEndpoint = RolesApiEndpoint;
