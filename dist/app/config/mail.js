"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportConfig = void 0;
var _a = process.env, UserMail = _a.UserMail, PasswordMail = _a.PasswordMail, HostMail = _a.HostMail;
exports.transportConfig = {
    host: HostMail,
    port: 465,
    secure: true,
    auth: {
        user: UserMail,
        pass: PasswordMail
    }
};
