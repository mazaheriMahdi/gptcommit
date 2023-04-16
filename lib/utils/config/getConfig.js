"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const fs_1 = require("fs");
const ConfigNotFound_1 = require("../../Exeptions/ConfigNotFound");
async function getConfig() {
    return new Promise((resolve, reject) => {
        if ((0, fs_1.existsSync)("./.gptcommit")) {
            (0, fs_1.readFile)("./.gptcommit", (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.toString().split("\n"));
                }
            });
        }
        else {
            reject(new ConfigNotFound_1.ConfigNotFound());
        }
    });
}
exports.getConfig = getConfig;
