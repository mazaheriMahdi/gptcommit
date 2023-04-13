"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.bulder = exports.desc = exports.command = void 0;
const main_1 = require("../utils/main");
const prompts_1 = require("@clack/prompts");
exports.command = "commit";
exports.desc = "Generating AI commit messages";
const bulder = (yargs) => yargs.options({
    a: { type: "boolean" },
    y: { type: "boolean" },
});
exports.bulder = bulder;
const handler = (argv) => {
    (0, main_1.Main)(argv).catch((err) => {
        prompts_1.log.error(err.message);
    });
};
exports.handler = handler;
