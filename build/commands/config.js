"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const config_1 = require("../utils/config");
const prompts_1 = require("@clack/prompts");
exports.command = 'config';
exports.desc = 'config your gptCommit';
const builder = (yargs) => yargs;
exports.builder = builder;
const handler = (argv) => {
    (0, config_1.config)().catch((e) => prompts_1.log.error(e.message));
};
exports.handler = handler;
