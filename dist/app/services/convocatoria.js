'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.deleteAdjunto = exports.files = exports.updateAnnoucements = exports.searchConvocatoria = exports.getUsers = exports.deleteAnnucements = exports.getActiveAnnoucements = exports.getAllAnnoucements = exports.sendMail = void 0;
var adjuntos_1 = require("&helpers/adjuntos");
var index_1 = __importDefault(require("&mail/index"));
var index_2 = __importDefault(require("&database/index"));
var moment_1 = __importDefault(require("moment"));
var convocatorias_1 = require("../helpers/sql/convocatorias");
var filesExists_1 = require("../helpers/filesExists");
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
var db = index_2.default.init().connection;
var email = index_1.default.init();
var sendMail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, from, to, asunto, detalle, fecha, usuario, files, archivos, emailConfig, sql, _b, data, info, id_1, file_adjuntos, aux;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = JSON.parse(req.body.data), from = _a.from, to = _a.to, asunto = _a.asunto, detalle = _a.detalle, fecha = _a.fecha, usuario = _a.usuario;
                files = req.files;
                archivos = [];
                emailConfig = {
                    from: from,
                    to: to,
                    subject: asunto,
                    html: detalle
                };
                if (!from || !to)
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            msg: 'no existe destinatario o información del usuario que remite el correo'
                        })];
                if (!(moment_1.default(fecha).isValid() && moment_1.default(fecha) >= moment_1.default(new Date()))) return [3 /*break*/, 2];
                sql = "insert into Convocatoria(asunto,fecha,detalle,usuario,destinatarios) values(?,'" + moment_1.default(fecha).format('yyyy-MM-DD HH:mm') + "',?,?,?);";
                return [4 /*yield*/, db.execute(sql, [asunto, detalle, usuario, JSON.stringify(to)])];
            case 1:
                _b = _c.sent(), data = _b[0], info = _b[1];
                id_1 = data['insertId'];
                if (files) {
                    file_adjuntos = files.adjuntos;
                    if (!Array.isArray(file_adjuntos)) {
                        aux = file_adjuntos;
                        file_adjuntos = [];
                        file_adjuntos[0] = aux;
                    }
                    archivos = adjuntos_1.adjuntos(file_adjuntos, id_1, false);
                    emailConfig = __assign(__assign({}, emailConfig), { attachments: archivos });
                    if (archivos.length > 0) {
                        archivos.forEach(function (_a) {
                            var filename = _a.filename;
                            return __awaiter(void 0, void 0, void 0, function () {
                                var sql;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            sql = "insert into AdjuntoConvocatoria(convocatoria, nombre) values(?,?);";
                                            return [4 /*yield*/, db.execute(sql, [id_1, filename])];
                                        case 1:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                    }
                }
                email.sendMail(emailConfig, function (err) {
                    if (err)
                        return res.status(500).json({
                            ok: false,
                            msg: 'Oh no! ocurrio un error inesperado, Por favor contacta con un administrador',
                            err: err
                        });
                    return res.status(200).json({
                        ok: true,
                        msg: 'Convocatoria enviada y registrada con exito',
                        id: id_1
                    });
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, res.status(400).json({
                    ok: false,
                    msg: 'La fecha y hora especificada no son válidas para el día seleccionado'
                })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendMail = sendMail;
var getAllAnnoucements = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pagina, _a, rol, email, cant_registros, inicio, sql, sql_reg, data, registros, registrosdata;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pagina = req.params.pagina;
                _a = req.body.payload.payload, rol = _a.rol, email = _a.email;
                if (!pagina)
                    return [2 /*return*/, res.status(404).json({
                            ok: false,
                            msg: 'Incluir el parametro para el numero de pagina'
                        })];
                cant_registros = 10;
                inicio = cant_registros * Number(pagina) - cant_registros;
                sql = '';
                sql_reg = '';
                if (rol === 1) {
                    sql = "select c.id, c.asunto, c.fecha, c.detalle,  c.destinatarios as 'to', u.username as usuario\n            from Convocatoria c\n            inner join Usuario u\n            on c.usuario=u.id\n            order by c.id asc \n            limit ? \n            offset ?;";
                    sql_reg = "select count(*) as registros from Convocatoria;";
                }
                else {
                    sql = "select c.id, c.asunto, c.fecha, c.detalle,  c.destinatarios as 'to', u.username as usuario\n            from Convocatoria c\n            inner join Usuario u\n            on c.usuario=u.id\n            where c.destinatarios like '%" + email + "%'\n            order by c.id asc \n            limit ? \n            offset ?;";
                    sql_reg = "select count(*) as registros from Convocatoria where destinatarios like '%" + email + "%';";
                }
                return [4 /*yield*/, db.execute(sql, [cant_registros.toString(), inicio.toString()])];
            case 1:
                data = (_b.sent())[0];
                return [4 /*yield*/, db.execute(sql_reg)];
            case 2:
                registros = (_b.sent())[0];
                if (!data || !registros)
                    return [2 /*return*/, res.status(404).json({
                            ok: false,
                            msg: 'no existen convocatorias'
                        })];
                registrosdata = filesExists_1.filesExists(data, res);
                return [2 /*return*/, res.json({
                        ok: true,
                        data: registrosdata,
                        registros: registros
                    })];
        }
    });
}); };
exports.getAllAnnoucements = getAllAnnoucements;
var getActiveAnnoucements = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rol, email, currentDate, sql, data, registros;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body.payload.payload, rol = _a.rol, email = _a.email;
                currentDate = moment_1.default(Date.now());
                sql = '';
                if (rol === 1) {
                    sql = "select c.id, c.asunto, c.fecha, c.detalle, c.usuario, c.destinatarios as 'to'\n            from Convocatoria c\n            where fecha >= ?;";
                }
                else {
                    sql = "select c.id, c.asunto, c.fecha, c.detalle, c.usuario, c.destinatarios as 'to'\n            from Convocatoria c\n            where c.destinatarios like '%" + email + "%'\n            and fecha >= ?;";
                }
                return [4 /*yield*/, db.execute(sql, [currentDate.format('yyyy-MM-DD HH:mm')])];
            case 1:
                data = (_b.sent())[0];
                registros = filesExists_1.filesExists(data, res);
                return [2 /*return*/, res.json({
                        ok: true,
                        data: registros
                    })];
        }
    });
}); };
exports.getActiveAnnoucements = getActiveAnnoucements;
var deleteAnnucements = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, children, sql, ruta;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                children = "delete ad\n        from AdjuntoConvocatoria ad\n        inner join Convocatoria c\n        on ad.convocatoria=c.id\n        where c.id=?;";
                sql = 'delete from Convocatoria where id=?';
                return [4 /*yield*/, db.execute(children, [id])];
            case 1:
                _a.sent();
                return [4 /*yield*/, db.execute(sql, [id])];
            case 2:
                _a.sent();
                ruta = "" + path_1.resolve(__dirname, "../files/" + id);
                if (fs_1.default.existsSync(ruta)) {
                    fs_1.default.rmdirSync(ruta, { recursive: true });
                }
                return [2 /*return*/, res.json({
                        ok: true,
                        msg: 'Convocatoria eleminada correctamente!'
                    })];
        }
    });
}); };
exports.deleteAnnucements = deleteAnnucements;
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sql = "select p.correo\n        from Usuario u \n        inner join Persona p \n        on u.persona=p.id";
                return [4 /*yield*/, db.execute(sql)];
            case 1:
                data = (_a.sent())[0];
                return [2 /*return*/, res.json({
                        ok: true,
                        data: data
                    })];
        }
    });
}); };
exports.getUsers = getUsers;
var searchConvocatoria = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, sql, sql_registros, data, registros;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = convocatorias_1.searchconv(req, res), sql = _a.sql, sql_registros = _a.sql_registros;
                return [4 /*yield*/, db.execute(sql)];
            case 1:
                data = (_b.sent())[0];
                return [4 /*yield*/, db.execute(sql_registros)];
            case 2:
                registros = (_b.sent())[0];
                if (!data || !registros)
                    return [2 /*return*/, res.status(404).json({
                            ok: false,
                            msg: 'no existen convocatorias'
                        })];
                return [2 /*return*/, res.status(200).json({
                        ok: true,
                        data: data,
                        registros: registros
                    })];
        }
    });
}); };
exports.searchConvocatoria = searchConvocatoria;
var updateAnnoucements = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, from, to, asunto, detalle, fecha, files, archivos, emailConfig, sql, ruta, file_adjuntos, aux, dir, i;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = JSON.parse(req.body.data), from = _a.from, to = _a.to, asunto = _a.asunto, detalle = _a.detalle, fecha = _a.fecha;
                files = req.files;
                archivos = [];
                emailConfig = {
                    from: from,
                    to: to,
                    subject: asunto + " - actualizaci\u00F3n de convocatoria " + id,
                    html: detalle
                };
                if (!(moment_1.default(fecha).isValid() && moment_1.default(fecha) >= moment_1.default(new Date()))) return [3 /*break*/, 2];
                sql = "update Convocatoria\n            set asunto=?,\n            fecha=?,\n            detalle=?,\n            destinatarios=?\n            where id=?";
                return [4 /*yield*/, db.execute(sql, [asunto, moment_1.default(fecha).format('yyyy-MM-DD HH:mm'), detalle, JSON.stringify(to), id])];
            case 1:
                _b.sent();
                ruta = "" + path_1.resolve(__dirname, "../files/convocatoria/" + id);
                if (!fs_1.default.existsSync(ruta)) {
                    fs_1.default.mkdirSync(ruta);
                }
                if (files) {
                    file_adjuntos = files.adjuntos;
                    if (!Array.isArray(file_adjuntos)) {
                        aux = file_adjuntos;
                        file_adjuntos = [];
                        file_adjuntos[0] = aux;
                    }
                    archivos = adjuntos_1.adjuntos(file_adjuntos, Number(id), true);
                    emailConfig = __assign(__assign({}, emailConfig), { attachments: archivos });
                    if (archivos.length > 0) {
                        archivos.forEach(function (_a) {
                            var filename = _a.filename;
                            return __awaiter(void 0, void 0, void 0, function () {
                                var sqldelete, sql;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            sqldelete = "delete from AdjuntoConvocatoria where nombre=?";
                                            sql = "insert into AdjuntoConvocatoria(convocatoria, nombre) values(?,?);";
                                            return [4 /*yield*/, db.execute(sqldelete, [filename])];
                                        case 1:
                                            _b.sent();
                                            return [4 /*yield*/, db.execute(sql, [id, filename])];
                                        case 2:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                    }
                }
                else {
                    dir = fs_1.default.readdirSync(ruta);
                    for (i in dir) {
                        archivos.push({
                            filename: dir[i],
                            content: fs_1.default.readFileSync(ruta + "/" + dir[i])
                        });
                    }
                }
                email.sendMail(emailConfig, function (err) {
                    if (err)
                        return res.status(500).json({
                            ok: false,
                            msg: 'Oh no! ocurrio un error inesperado, Por favor contacta con un administrador',
                            err: err
                        });
                    return res.status(200).json({
                        ok: true,
                        msg: 'Convocatoria enviada y registrada con exito',
                        id: id
                    });
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, res.status(400).json({
                    ok: false,
                    msg: 'La fecha y hora especificada no son válidas para el día seleccionado'
                })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateAnnoucements = updateAnnoucements;
var files = function (req, res) {
    var _a = req.params, id = _a.id, filename = _a.filename;
    var path = path_1.resolve(__dirname, "../files/" + id + "/" + filename);
    if (fs_1.default.existsSync(path)) {
        return res.sendFile(path);
    }
    else {
        return res.json({
            ok: false,
            msg: 'no existen archivos para esta convocatoria'
        });
    }
};
exports.files = files;
var deleteAdjunto = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, filename, path, sql;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, id = _a.id, filename = _a.filename;
                path = path_1.resolve(__dirname, "../files/" + id);
                if (!fs_1.default.existsSync(path + "/" + filename)) return [3 /*break*/, 2];
                fs_1.default.unlinkSync(path + "/" + filename);
                if (fs_1.default.readdirSync(path).length <= 0) {
                    fs_1.default.rmdirSync(path);
                }
                sql = "delete from AdjuntoConvocatoria where convocatoria=? and nombre=?;";
                return [4 /*yield*/, db.execute(sql, [id, filename])];
            case 1:
                _b.sent();
                return [2 /*return*/, res.json({
                        ok: true,
                        msg: "Archivo " + filename + " eliminado del servidor correctamente"
                    })];
            case 2: return [2 /*return*/, res.json({
                    ok: false,
                    msg: 'no existen archivos para esta convocatoria'
                })];
        }
    });
}); };
exports.deleteAdjunto = deleteAdjunto;
