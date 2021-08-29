"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = require("mysql2/promise");
var db_1 = require("&config/db");
var Database = /** @class */ (function () {
    function Database() {
        this.opts = db_1.config;
        this.connect = promise_1.createPool(this.opts);
    }
    Database.init = function () {
        if (!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    };
    Object.defineProperty(Database.prototype, "connection", {
        get: function () {
            return this.connect;
        },
        enumerable: false,
        configurable: true
    });
    return Database;
}());
exports.default = Database;
