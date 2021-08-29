"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("&services/auth");
var jwt_1 = require("&middlewares/jwt");
var auth_2 = __importDefault(require("&middlewares/validations/auth"));
var isVal_1 = __importDefault(require("&middlewares/validations/isVal"));
var AuthRoutes = /** @class */ (function () {
    function AuthRoutes() {
        this.route = express_1.Router();
        this.init();
    }
    AuthRoutes.init = function () {
        return this.instance = new AuthRoutes();
    };
    AuthRoutes.prototype.Routes = function (path) {
        return this.Route.route("/auth" + path);
    };
    AuthRoutes.prototype.init = function () {
        this.Routes('/login')
            .post(__spreadArray(__spreadArray([], auth_2.default()), [isVal_1.default]), auth_1.login);
        this.Routes('/refreshtoken')
            .get(jwt_1.verifyToken, auth_1.refreshToken);
    };
    Object.defineProperty(AuthRoutes.prototype, "Route", {
        get: function () {
            return this.route;
        },
        enumerable: false,
        configurable: true
    });
    return AuthRoutes;
}());
exports.default = AuthRoutes;
