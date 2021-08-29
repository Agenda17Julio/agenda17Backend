"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesExists = void 0;
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
var filesExists = function (data, res) {
    if (!data)
        return res.status(404).json({
            ok: false,
            msg: 'no existen convocatorias'
        });
    var registros = data;
    for (var i in registros) {
        var id = registros[i]['id'];
        var path = path_1.resolve(__dirname, "../files/" + id);
        if (fs_1.default.existsSync(path)) {
            registros[i].files = fs_1.default.readdirSync(path);
            ;
        }
        ;
    }
    return registros;
};
exports.filesExists = filesExists;
