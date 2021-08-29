"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var server = /** @class */ (function () {
    function server(port, name) {
        this.app = express_1.default();
        this.port = port;
        this.name = name;
        this.OnInit();
    }
    server.prototype.OnInit = function () {
        this.Parser();
        this.FileUpload();
        this.Cors();
        this.Public();
    };
    server.prototype.Parser = function () {
        this.app.use(express_1.json());
        this.app.use(express_1.urlencoded({ extended: true }));
    };
    server.prototype.FileUpload = function () {
        this.app.use(express_fileupload_1.default());
    };
    server.prototype.Cors = function () {
        this.app.use(cors_1.default({
            origin: [
                'http://localhost'
            ]
        }));
    };
    server.prototype.Public = function () {
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../../../public')));
    };
    Object.defineProperty(server.prototype, "getName", {
        get: function () {
            return this.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(server.prototype, "getPort", {
        get: function () {
            return this.port;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(server.prototype, "getApp", {
        get: function () {
            return this.app;
        },
        enumerable: false,
        configurable: true
    });
    return server;
}());
exports.default = server;
