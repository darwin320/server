"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Action = connection_1.default.define('Action', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    method: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    url: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: sequelize_1.DataTypes.DATE(3),
        allowNull: false
    },
    userEmail: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
});
