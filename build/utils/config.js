"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const prompts_1 = require("@clack/prompts");
const fs_1 = require("fs");
async function config() {
    (0, prompts_1.intro)("GptCommit Config");
    var regex = /^(sk-).{48}/;
    const apiKey = await (0, prompts_1.text)({
        message: "Your OpenAi Api key",
        placeholder: "sl-***************************",
        validate(value) {
            if (!regex.test(value)) {
                return "Invalid Api Key";
            }
        },
    });
    const numberOfCommitMessages = await (0, prompts_1.text)({
        message: "Number of commit messages to generate",
        placeholder: "3",
        validate(value) {
            if (isNaN(Number(value)) || Number(value) <= 0) {
                return "Please enter a valid number";
            }
            else if (Number(value) > 10) {
                return "Generating more than 10 commit messages is not allowed 😔";
            }
        }
    });
    const file = (0, fs_1.writeFileSync)("./config.txt", apiKey.toString() + "\n" + numberOfCommitMessages.toString());
    (0, prompts_1.outro)("You have successfully configured GptCommit🍺");
}
exports.config = config;
