"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jwt_1 = require("&middlewares/jwt");
var convocatoria_1 = require("&services/convocatoria");
var ConvocatoriaRoutes = /** @class */ (function () {
    function ConvocatoriaRoutes() {
        this.route = express_1.Router();
        this.init();
    }
    ConvocatoriaRoutes.init = function () {
        return new ConvocatoriaRoutes();
    };
    ConvocatoriaRoutes.prototype.Middlewares = function () {
        this.route.use(jwt_1.verifyToken);
    };
    ConvocatoriaRoutes.prototype.Routes = function (path) {
        return this.Route.route("/convocatoria" + path);
    };
    ConvocatoriaRoutes.prototype.init = function () {
        this.Middlewares();
        this.Routes('/mail')
            .post(convocatoria_1.sendMail);
        this.Routes('/users')
            .get(convocatoria_1.getUsers);
        this.Routes('/annoucements/:pagina')
            .get(convocatoria_1.getAllAnnoucements);
        this.Routes('/allannoucements/active')
            .get(convocatoria_1.getActiveAnnoucements);
        this.Routes('/search/:pagina')
            .post(convocatoria_1.searchConvocatoria);
        this.Routes('/annoucements/:id')
            .delete(convocatoria_1.deleteAnnucements)
            .put(convocatoria_1.updateAnnoucements);
        this.Routes('/files/:id/:filename')
            .get(convocatoria_1.files);
        this.Routes('/adjunto/:id/:filename')
            .delete(convocatoria_1.deleteAdjunto);
    };
    Object.defineProperty(ConvocatoriaRoutes.prototype, "Route", {
        get: function () {
            return this.route;
        },
        enumerable: false,
        configurable: true
    });
    return ConvocatoriaRoutes;
}());
exports.default = ConvocatoriaRoutes;
