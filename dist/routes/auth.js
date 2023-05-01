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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthModule = exports.authorizeOnRole = exports.authorize = void 0;
const bcrypt_1 = require("bcrypt");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userDatabase_1 = require("../db/userDatabase");
const permissions_1 = require("../auth/permissions");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
passport_1.default.use("local", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, function verify(email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userDatabase_1.UserDatabase.getUserByEmail(email);
        if (user) {
            if ((0, bcrypt_1.compareSync)(password, user.password)) {
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, "Claralia");
                return done(null, { user: user, token });
            }
            else {
                return done(null, false, {
                    message: "Incorrect password",
                });
            }
        }
        else {
            return done(null, false, {
                message: "Incorrect username",
            });
        }
    });
}));
passport_1.default.serializeUser((user, done) => {
    const us = user;
    done(null, us.user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userDatabase_1.UserDatabase.getUserById(id);
    done(null, user);
}));
function authorize(request, response, next) {
    if (request.user) {
        next();
    }
    else {
        response.sendStatus(401);
    }
}
exports.authorize = authorize;
function authorizeOnRole(request, response, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const user = request.user;
        const token = (_b = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) === null || _b === void 0 ? void 0 : _b.replace(/^"|"$/g, "");
        const check = user && token;
        if (request.user) {
            const decodedToken = jsonwebtoken_1.default.verify(token, "Claralia");
            const userId = decodedToken.userId;
            const dbUser = yield userDatabase_1.UserDatabase.getUserById(userId);
            // You see all of this?
            // All of this is needed so we take the second part of the url to see
            // if the user has permission to the API route. So, take a look a this
            // example:
            //
            // /api/users: This should list the users, but how we make sure that
            // we get the 'users' part? That's why this is done.
            //s
            // First, we replace the empty spaces, just to be safe, then we split
            // the url. After that, we remove the empty values from the array and
            // we get the second element and boom. We got it.
            const routeApi = request.route.path
                .replace(/ /g, "")
                .split("/")
                .filter((e) => e.length > 0)[1];
            // ====================================================================
            const permission = yield (0, permissions_1.getUserRolePermissionsOnAPI)(request.user.id, 
            // This is needed so the arguments, queries and such, don't kill this.
            routeApi);
            // Check if the permission exists and then if the role can execute that
            // permission.
            if (permission && (0, permissions_1.canRoleExecuteMethod)(permission, request.method) && dbUser) {
                request.user = dbUser;
                next();
            }
            else {
                response.sendStatus(401);
            }
        }
        else {
            response.sendStatus(401);
        }
    });
}
exports.authorizeOnRole = authorizeOnRole;
function configureAuthModule(app) {
    app.post("/login/password", passport_1.default.authenticate("local", {
        failureMessage: true,
        successMessage: true,
    }), (req, res) => {
        const user = req.user;
        res.status(200).json({ token: user.token });
    });
    app.get("/auth/canActivate", authorize, (_, response) => response.sendStatus(200));
    app.post("/logout", authorize, (request, response, next) => {
        request.session.destroy((_) => {
            response.sendStatus(200);
        });
    });
}
exports.configureAuthModule = configureAuthModule;
