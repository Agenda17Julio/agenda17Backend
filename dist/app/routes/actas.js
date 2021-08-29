"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jwt_1 = require("&middlewares/jwt");
var actas_1 = require("&services/actas");
var ActaasRoutes = /** @class */ (function () {
    function ActaasRoutes() {
        this.route = express_1.Router();
        this.init();
    }
    ActaasRoutes.init = function () {
        return new ActaasRoutes();
    };
    ActaasRoutes.prototype.Middlewares = function () {
        this.route.use(jwt_1.verifyToken);
    };
    ActaasRoutes.prototype.Routes = function (path) {
        return this.Route.route("/actas" + path);
    };
    ActaasRoutes.prototype.init = function () {
        this.Middlewares();
        this.Routes('/add')
            .post(actas_1.addNewActa);
        this.Routes('/conv/:pagina')
            .get(actas_1.getAllActas);
        this.Routes('/delete/:id_acta')
            .delete(actas_1.deleteActa);
        this.Routes('/annoucement')
            .get(actas_1.getAnnoucementsActas);
        this.Routes('/adjuntos/:id_acta')
            .get(actas_1.getAllAdjuntosActa)
            .put(actas_1.updateActa);
        this.Routes('/adjuntos/:id_acta/:filename')
            .get(actas_1.getAdjunto)
            .delete(actas_1.deleteAdjunto);
    };
    Object.defineProperty(ActaasRoutes.prototype, "Route", {
        get: function () {
            return this.route;
        },
        enumerable: false,
        configurable: true
    });
    return ActaasRoutes;
}());
exports.default = ActaasRoutes;
