"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigNotFound = void 0;
class ConfigNotFound extends Error {
    constructor() {
        super('You have not configured GptCommit yet. Please run gptCommit config to configure GptCommit');
    }
}
exports.ConfigNotFound = ConfigNotFound;
