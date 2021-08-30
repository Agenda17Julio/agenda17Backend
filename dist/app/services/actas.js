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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdjunto = exports.getAdjunto = exports.getAllAdjuntosActa = exports.getAnnoucementsActas = exports.getAllActas = exports.deleteActa = exports.updateActa = exports.addNewActa = void 0;
var index_1 = __importDefault(require("&database/index"));
var path_1 = require("path");
var fs_1 = require("fs");
var db = index_1.default.init().connection;
var addNewActa = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conv_id, data, id, file_adjuntos, aux, path, adjuntos_res, _a, _b, _i, i, _c, name_1, data_1, mv, adj;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                conv_id = req.query.conv_id;
                if (!req.files)
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            msg: "Files doesn't exists"
                        })];
                return [4 /*yield*/, db.execute('insert into actas (convocatoria) values(?);', [conv_id])];
            case 1:
                data = (_d.sent())[0];
                id = data['insertId'];
                file_adjuntos = req.files.actasadj;
                if (!Array.isArray(file_adjuntos)) {
                    aux = file_adjuntos;
                    file_adjuntos = [];
                    file_adjuntos[0] = aux;
                }
                path = path_1.resolve(__dirname, "../files/actas/" + id);
                if (!fs_1.existsSync(path)) {
                    console.log(path);
                    fs_1.mkdirSync(path, { recursive: true });
                }
                adjuntos_res = [];
                _a = [];
                for (_b in file_adjuntos)
                    _a.push(_b);
                _i = 0;
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                i = _a[_i];
                _c = file_adjuntos[i], name_1 = _c.name, data_1 = _c.data, mv = _c.mv;
                mv(path + "/" + name_1);
                return [4 /*yield*/, db.execute('insert into actaAdjuntos(filename,acta) values(?,?);', [name_1, id])];
            case 3:
                adj = (_d.sent())[0];
                adjuntos_res.push({
                    filename: name_1,
                    id: adj['insertId'],
                    acta: id
                });
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, res.json({
                    ok: true,
                    id_acta: id,
                    adjuntos_res: adjuntos_res
                })];
        }
    });
}); };
exports.addNewActa = addNewActa;
var updateActa = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_acta, file_adjuntos, aux, path, adjuntos_res, _a, _b, _i, i, _c, name_2, data, mv, adj;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                id_acta = req.params.id_acta;
                if (!req.files)
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            msg: "Files doesn't exists"
                        })];
                file_adjuntos = req.files.actasadj;
                if (!Array.isArray(file_adjuntos)) {
                    aux = file_adjuntos;
                    file_adjuntos = [];
                    file_adjuntos[0] = aux;
                }
                path = path_1.resolve(__dirname, "../files/actas/" + id_acta);
                if (!fs_1.existsSync(path)) {
                    fs_1.mkdirSync(path, { recursive: true });
                }
                adjuntos_res = [];
                _a = [];
                for (_b in file_adjuntos)
                    _a.push(_b);
                _i = 0;
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                i = _a[_i];
                _c = file_adjuntos[i], name_2 = _c.name, data = _c.data, mv = _c.mv;
                mv(path + "/" + name_2);
                return [4 /*yield*/, db.execute('insert into actaAdjuntos(filename,acta) values(?,?);', [name_2, id_acta])];
            case 2:
                adj = (_d.sent())[0];
                adjuntos_res.push({
                    id: adj['insertId'],
                    filename: name_2,
                    acta: Number(id_acta)
                });
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                res.json({
                    ok: true,
                    adjuntos_res: adjuntos_res
                });
                return [2 /*return*/];
        }
    });
}); };
exports.updateActa = updateActa;
var deleteActa = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_acta, path, files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id_acta = req.params.id_acta;
                path = path_1.resolve(__dirname, "../files/actas/" + id_acta);
                if (!fs_1.existsSync(path))
                    return [2 /*return*/, res.status(500).json({
                            ok: false,
                            msg: 'Something went wrong!'
                        })];
                files = fs_1.readdirSync(path);
                files.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, db.execute('delete from actaAdjuntos where acta=?', [id_acta])];
                            case 1:
                                _a.sent();
                                fs_1.unlinkSync(path + "/" + file);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, db.execute('delete from actas where id=?', [id_acta])];
            case 1:
                _a.sent();
                fs_1.rmdirSync(path);
                res.json({
                    ok: true,
                    msg: 'Acta deleted successfully'
                });
                return [2 /*return*/];
        }
    });
}); };
exports.deleteActa = deleteActa;
var getAllActas = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pagina, _a, rol, email, sql, cant_registros, inicio, data, actas, reg, _b, _c, _i, i, sqladjuntos, conv;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                pagina = req.params.pagina;
                _a = req.body.payload.payload, rol = _a.rol, email = _a.email;
                sql = function (info) { return "select " + info + "\n        from actas act\n        inner join Convocatoria conv\n        on act.convocatoria = conv.id\n        inner join Usuario u \n        on conv.usuario=u.id\n        where u.rol=" + rol + "\n        and conv.destinatarios like '%" + email + "%'\n        order by act.id"; };
                cant_registros = 10;
                inicio = cant_registros * Number(pagina) - cant_registros;
                return [4 /*yield*/, db.execute(sql('act.id, conv.id as id_conv, conv.asunto') + " limit ? offset ?;", [
                        cant_registros.toString(),
                        inicio.toString()
                    ])];
            case 1:
                data = (_d.sent())[0];
                actas = data;
                return [4 /*yield*/, db.execute(sql('count(*) as registros'), [rol, email])];
            case 2:
                reg = (_d.sent())[0];
                _b = [];
                for (_c in actas)
                    _b.push(_c);
                _i = 0;
                _d.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                i = _b[_i];
                sqladjuntos = "select * from actaAdjuntos where acta=?;";
                return [4 /*yield*/, db.execute(sqladjuntos, [actas[i].id])];
            case 4:
                conv = (_d.sent())[0];
                actas[i].adjuntos = conv;
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, res.json({
                    ok: true,
                    actas: actas,
                    registros: reg[0].registros
                })];
        }
    });
}); };
exports.getAllActas = getAllActas;
var getAnnoucementsActas = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.execute('select id, asunto from Convocatoria')];
            case 1:
                data = (_a.sent())[0];
                return [2 /*return*/, res.json({
                        ok: true,
                        data: data
                    })];
        }
    });
}); };
exports.getAnnoucementsActas = getAnnoucementsActas;
var getAllAdjuntosActa = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id_acta;
                return [4 /*yield*/, db.execute('select id,filename from actaAdjuntos where acta=?;', [id])];
            case 1:
                data = (_a.sent())[0];
                return [2 /*return*/, res.json({
                        ok: true,
                        id: id,
                        data: data
                    })];
        }
    });
}); };
exports.getAllAdjuntosActa = getAllAdjuntosActa;
var getAdjunto = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id_acta, filename, path;
    return __generator(this, function (_b) {
        _a = req.params, id_acta = _a.id_acta, filename = _a.filename;
        path = path_1.resolve(__dirname, "../files/actas/" + id_acta + "/" + filename);
        if (!fs_1.existsSync(path))
            return [2 /*return*/, res.status(500).json({
                    ok: false,
                    msg: 'Something went wrong!'
                })];
        return [2 /*return*/, res.download(path)];
    });
}); };
exports.getAdjunto = getAdjunto;
var deleteAdjunto = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id_acta, filename, path;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, id_acta = _a.id_acta, filename = _a.filename;
                path = path_1.resolve(__dirname, "../files/actas/" + id_acta);
                if (!fs_1.existsSync(path + "/" + filename))
                    return [2 /*return*/, res.status(500).json({
                            ok: false,
                            msg: 'Something went wrong!'
                        })];
                fs_1.unlinkSync(path + "/" + filename);
                return [4 /*yield*/, db.execute('delete from actaAdjuntos where acta=? and filename=?', [id_acta, filename])];
            case 1:
                _b.sent();
                return [2 /*return*/, res.json({
                        ok: true,
                        msg: 'File was deleted'
                    })];
        }
    });
}); };
exports.deleteAdjunto = deleteAdjunto;
