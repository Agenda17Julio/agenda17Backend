"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
exports.default = (function (req, res, next) {
    var val = express_validator_1.validationResult(req);
    if (!val.isEmpty()) {
        return res.status(400).json({
            ok: false,
            err: val.mapped()
        });
    }
    else {
        return next();
    }
});
