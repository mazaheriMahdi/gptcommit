"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const fs_1 = require("fs");
const ConfigNotFound_1 = require("../../Exeptions/ConfigNotFound");
async function getConfig() {
    if ((0, fs_1.existsSync)("./config.txt")) {
        return new Promise((resolve, reject) => {
            (0, fs_1.readFile)("./config.txt", (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.toString().split("\n"));
                }
            });
        });
    }
    else {
        throw new ConfigNotFound_1.ConfigNotFound();
    }
}
exports.getConfig = getConfig;
