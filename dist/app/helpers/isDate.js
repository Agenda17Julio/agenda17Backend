"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
exports.default = (function (value, _a) {
    var req = _a.req, location = _a.location, path = _a.path;
    return moment_1.default(value).isValid();
});
