"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = require("nodemailer");
var mail_1 = require("&config/mail");
var EMail = /** @class */ (function () {
    function EMail() {
        this.transporterConfig = mail_1.transportConfig;
    }
    EMail.init = function () {
        if (!EMail.instance) {
            EMail.instance = new EMail();
        }
        return EMail.instance;
    };
    Object.defineProperty(EMail.prototype, "Transporter", {
        get: function () {
            if (!this.transport) {
                this.transport = nodemailer_1.createTransport(this.transporterConfig);
            }
            return this.transport;
        },
        enumerable: false,
        configurable: true
    });
    EMail.prototype.sendMail = function (optsMail, Callback) {
        return this.Transporter.sendMail(optsMail, Callback());
    };
    return EMail;
}());
exports.default = EMail;
