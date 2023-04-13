"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendDiff = void 0;
const openAi_1 = require("./openAi");
const getConfig_1 = require("../config/getConfig");
class SendDiff {
    constructor(data) {
        this.data = data;
    }
    async send() {
        return new Promise((resolve, rejects) => {
            const config = (0, getConfig_1.getConfig)().then((config) => {
                const openAi = new openAi_1.GptCommit(Number(config[1]), config[0]);
                openAi.getCommitMessage(this.data).then((data) => resolve(data));
            });
        });
    }
}
exports.SendDiff = SendDiff;
