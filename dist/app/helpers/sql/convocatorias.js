"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchconv = void 0;
var searchconv = function (req, res) {
    var pagina = req.params.pagina;
    var _a = req.body, asunto_check = _a.asunto_check, autor_check = _a.autor_check, fecha_check = _a.fecha_check, asunto = _a.asunto, autor = _a.autor, fecha = _a.fecha;
    if (!asunto_check && !autor_check && !fecha_check) {
        return res.status(400).json({
            ok: false,
            msg: 'Por favor selecciona un criterio de busqueda'
        });
    }
    ;
    if (!pagina)
        return res.status(400).json({
            ok: false,
            msg: 'Por favor ingrese la pagina que desea consultar'
        });
    var cant_registros = 10;
    3;
    var inicio = cant_registros * Number(pagina) - cant_registros;
    var sql = "select c.id, c.asunto, c.fecha, c.detalle,u.username as usuario\n        from Convocatoria c \n        inner join Usuario u \n        on c.usuario=u.id";
    var sql_registros = "";
    if (asunto_check && autor_check && fecha_check) {
        sql = sql + " where c.asunto like '%" + asunto + "%'\n            and u.username like '%" + autor + "%'\n            and c.fecha like '" + fecha + "%'\n            limit " + cant_registros + " \n            offset " + inicio + ";";
        sql_registros = "select count(*) as registros\n            from Convocatoria c \n            inner join Usuario u \n            on c.usuario=u.id \n            where c.asunto like '%" + asunto + "%'\n            and u.username like '%" + autor + "%'\n            and c.fecha like '" + fecha + "%'";
    }
    else if (asunto_check && autor_check && !fecha_check) {
        sql = sql + " where c.asunto like '%" + asunto + "%'\n            and u.username like '%" + autor + "%'\n            limit " + cant_registros + " \n            offset " + inicio + ";";
        sql_registros = "select count(*) as registros\n                from Convocatoria c \n                inner join Usuario u \n                on c.usuario=u.id \n                where c.asunto like '%" + asunto + "%'\n                and u.username like '%" + autor + "%'";
    }
    else if (asunto_check && fecha_check && !autor_check) {
        sql = sql + " \n            where c.asunto like '%" + asunto + "%'\n            and c.fecha like '" + fecha + "%'\n            limit " + cant_registros + " \n            offset " + inicio + ";";
        sql_registros = "select count(*) as registros from Convocatoria where asunto like '%" + asunto + "%' and fecha like '" + fecha + "%'";
    }
    else if (autor_check && fecha_check && !asunto_check) {
        sql = sql + " where u.username like '%" + autor + "%'\n            and c.fecha like '" + fecha + "%'\n            limit " + cant_registros + " \n            offset " + inicio + ";";
        sql_registros = "select count(*) as registros\n                from Convocatoria c \n                inner join Usuario u \n                on c.usuario=u.id \n                where u.username like '%" + autor + "%'\n                and c.fecha like '" + fecha + "%'";
    }
    else if (asunto_check) {
        sql = sql + " where asunto like '%" + asunto + "%' limit " + cant_registros + " offset " + inicio + ";";
        sql_registros = "select count(*) as registros\n            from Convocatoria c \n            inner join Usuario u \n            on c.usuario=u.id \n            where c.asunto like '%" + asunto + "%'";
    }
    else if (autor_check) {
        sql = sql + " where u.username like '%" + autor + "%'\n            limit " + cant_registros + " \n            offset " + inicio + ";";
        sql_registros = "select count(*) as registros\n            from Convocatoria c \n            inner join Usuario u \n            on c.usuario=u.id \n            where u.username like '%" + autor + "%'";
    }
    else if (fecha_check) {
        sql = sql + " where fecha like '" + fecha + "%' limit " + cant_registros + " offset " + inicio + ";";
        sql_registros = "select count(*) as registros from Convocatoria where fecha like '" + fecha + "%'";
    }
    return {
        sql: sql,
        sql_registros: sql_registros
    };
};
exports.searchconv = searchconv;
