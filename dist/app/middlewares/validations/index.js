"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usernameVal = exports.passwordVal = exports.emailVal = void 0;
var express_validator_1 = require("express-validator");
var types_1 = __importDefault(require("./types"));
var emailVal = function () {
    var _a = types_1.default.email, field = _a.field, msg = _a.msg;
    return express_validator_1.check(field, msg)
        .isEmail()
        .not().isEmpty()
        .normalizeEmail();
};
exports.emailVal = emailVal;
var passwordVal = function () {
    var _a = types_1.default.password, field = _a.field, msg = _a.msg;
    return express_validator_1.check(field, msg)
        .not().isEmpty()
        .isString();
};
exports.passwordVal = passwordVal;
var usernameVal = function () {
    var _a = types_1.default.username, field = _a.field, msg = _a.msg;
    return express_validator_1.check(field, msg)
        .not().isEmpty()
        .isString();
};
exports.usernameVal = usernameVal;
