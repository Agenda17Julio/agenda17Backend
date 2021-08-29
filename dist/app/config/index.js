"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.config({ path: '.env' });
var NODE_ENV = process.env.NODE_ENV;
var env = NODE_ENV;
if (!env) {
    throw new Error('Configure environment in the file .env please!');
}
else if (env.includes('development' || 'production' || 'testing')) {
    dotenv_1.config({ path: ".env." + env });
}
else {
    throw new Error('The environment is invalid!');
}
