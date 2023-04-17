"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigNotFound = void 0;
const messages_1 = require("../messages/messages");
class ConfigNotFound extends Error {
    constructor() {
        super(messages_1.CONFIG_NOT_FOUND);
    }
}
exports.ConfigNotFound = ConfigNotFound;
