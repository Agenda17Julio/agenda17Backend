"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generarToken = function (payload) {
    var seed = process.env.SECRECT_JWT_SEED;
    var token = jsonwebtoken_1.sign({ payload: payload }, String(seed), {
        expiresIn: '30m'
    });
    return token;
};
exports.generarToken = generarToken;
