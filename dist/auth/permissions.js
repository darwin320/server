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
exports.canRoleExecuteMethod = exports.getUserRolePermissionsOnAPI = void 0;
const apiDatabase_1 = require("../db/apiDatabase");
const userDatabase_1 = require("../db/userDatabase");
/**
 * Use the user role, API route, to get the permissions the user has on that
 * route.
 */
function getUserRolePermissionsOnAPI(userId, apiName) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedUser = yield userDatabase_1.UserDatabase.getUserById(userId);
        const validatedApi = yield apiDatabase_1.ApiDatabase.getApi(apiName);
        if (validatedUser && validatedApi) {
            return yield apiDatabase_1.ApiDatabase.getApisOnRolesById(validatedApi.id, validatedUser.roleId);
        }
        else {
            return null;
        }
    });
}
exports.getUserRolePermissionsOnAPI = getUserRolePermissionsOnAPI;
function canRoleExecuteMethod(permission, request) {
    switch (request) {
        case "GET":
            return permission.get;
        case "PATCH":
        case "PUT":
        // FIXME: This PUT case is very important, we could just add another value
        // to the model and database, but for the moment we need to have this
        // working. So if the user can post, it means that it can also update
        // values.
        case "POST":
            return permission.post;
        case "DELETE":
            return permission.delete;
        default:
            // When other method is requested but we aren't using it.
            return false;
    }
}
exports.canRoleExecuteMethod = canRoleExecuteMethod;
