"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const prompts_1 = require("@clack/prompts");
async function config() {
    (0, prompts_1.intro)("GptCommit Config");
    var regex = /^(sk-).{48}/;
    const apiKey = await (0, prompts_1.text)({ message: "Your OpenAi Api key", placeholder: "sl-***************************", validate(value) {
            if (!regex.test(value)) {
                return "Invalid Api Key";
            }
        }, });
    (0, prompts_1.outro)("You have successfully configured GptCommit🍺");
}
exports.config = config;
