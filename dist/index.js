"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const apis_1 = require("./routes/apis");
const passport_1 = __importDefault(require("passport"));
const cron_js_1 = require("./cron/cron.js");
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({
    extended: true,
}));
app.use((0, cors_1.default)({
    origin: process.env.CORS_URL,
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: "Claralia",
    proxy: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.IS_PROD === "true",
        sameSite: process.env.IS_PROD === "true" ? "none" : false,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, auth_1.configureAuthModule)(app);
(0, apis_1.configureApiModule)(app);
cron_js_1.CronJobManager.getInstance();
app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}!`);
});
