"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("&server/index"));
var index_2 = __importDefault(require("&routes/index"));
var MainServer = /** @class */ (function (_super) {
    __extends(MainServer, _super);
    function MainServer(port, name) {
        var _this = _super.call(this, port, name) || this;
        _this.init();
        return _this;
    }
    MainServer.init = function (port, name) {
        return this.instance = new MainServer(port, name);
    };
    MainServer.prototype.init = function () {
        this.Routes();
    };
    MainServer.prototype.Routes = function () {
        return this.getApp.use('/api/v1', index_2.default);
    };
    MainServer.prototype.listenServer = function (Callback) {
        return this.getApp.listen(this.getPort, Callback());
    };
    return MainServer;
}(index_1.default));
exports.default = MainServer;
