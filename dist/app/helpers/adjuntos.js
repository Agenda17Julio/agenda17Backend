"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjuntos = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = require("path");
var adjuntos = function (adjuntos, id_conv, isUpdate) {
    var ruta = "" + path_1.resolve(__dirname, "../files/convocatoria/" + id_conv);
    if (!fs_1.default.existsSync(ruta)) {
        fs_1.default.mkdirSync(ruta, { recursive: true });
    }
    var data_adjuntos = [];
    for (var i in adjuntos) {
        var _a = adjuntos[i], name_1 = _a.name, data = _a.data, mv = _a.mv;
        mv(ruta + "/" + name_1);
        data_adjuntos.push({
            filename: name_1,
            content: data
        });
    }
    if (isUpdate) {
        var dir = fs_1.default.readdirSync(ruta);
        var dataread = [];
        for (var i in dir) {
            dataread.push({
                filename: dir[i],
                content: fs_1.default.readFileSync(ruta + "/" + dir[i])
            });
        }
        dataread.push.apply(dataread, data_adjuntos);
        return dataread;
    }
    else {
        return data_adjuntos;
    }
};
exports.adjuntos = adjuntos;
