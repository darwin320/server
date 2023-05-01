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
exports.UsersApiEndpoint = void 0;
const ts_results_1 = require("ts-results");
const audit_1 = require("../../audit/audit");
const userDatabase_1 = require("../../db/userDatabase");
const errors_1 = require("../../models/errors/errors");
const apiEndpoint_1 = require("../api/apiEndpoint");
const auth_1 = require("../auth");
class UsersApiEndpoint extends apiEndpoint_1.ApiEndpoint {
    getElementsType(app) {
        // throw new Error("Method not implemented.");
    }
    constructor() {
        super("users");
    }
    getElements(_app) { }
    searchElements(app) {
        app.post(this.getUrlWithExtension("search"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const search = request.body.userSearch;
            const skip = request.body.skip;
            const take = request.body.take;
            const result = yield userDatabase_1.UserDatabase.searchUser(search, skip, take);
            response.send(result);
        }));
    }
    getElementById(app) {
        app.get(this.getUrlWithExtension("get/:userId"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(request.params["userId"]);
            const result = yield userDatabase_1.UserDatabase.getUserById(userId, true);
            response.send(result);
        }));
    }
    createElement(app) {
        app.post(this.getUrlWithExtension("create"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield userDatabase_1.UserDatabase.createUser(request.body);
            response.locals.result = result;
            next();
        }), this.sendObjectResponse);
    }
    updateElement(app) {
        app.put(this.getUrlWithExtension("update/:userId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(request.params["userId"]);
            const result = yield userDatabase_1.UserDatabase.updateUser(userId, request.body);
            response.locals.result = result;
            next();
        }), this.sendObjectResponse);
    }
    deleteElement(app) {
        app.delete(this.getUrlWithExtension("delete/:userId"), auth_1.authorize, auth_1.authorizeOnRole, audit_1.logMotion, (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(request.params["userId"]);
            if (request.user.id == userId) {
                response.locals.result = (0, ts_results_1.Err)(errors_1.Errors.getErrorFromCode("CDCUE"));
            }
            response.locals.result = yield userDatabase_1.UserDatabase.deleteUser(userId);
            next();
        }), this.sendOkResponse);
    }
    registerCustomMethods(app) {
        app.get(this.getUrlWithExtension("current-user"), auth_1.authorize, auth_1.authorizeOnRole, (request, response) => __awaiter(this, void 0, void 0, function* () {
            response.send(request.user);
        }));
    }
}
exports.UsersApiEndpoint = UsersApiEndpoint;
