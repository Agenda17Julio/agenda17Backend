"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = __importDefault(require("&routes/auth"));
var convocatoria_1 = __importDefault(require("&routes/convocatoria"));
var actas_1 = __importDefault(require("&routes/actas"));
var auth = auth_1.default.init();
var convocatoria = convocatoria_1.default.init();
var actas = actas_1.default.init();
exports.default = [auth.Route, convocatoria.Route, actas.Route];
