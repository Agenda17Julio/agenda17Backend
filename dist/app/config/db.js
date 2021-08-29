"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var _a = process.env, DB_HOST = _a.DB_HOST, DB_USER = _a.DB_USER, DB_PASSWORD = _a.DB_PASSWORD, DB_NAME = _a.DB_NAME;
exports.config = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
