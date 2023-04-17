"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const prompts_1 = require("@clack/prompts");
const fs_1 = require("fs");
const messages_1 = require("../messages/messages");
async function config() {
    (0, prompts_1.intro)(messages_1.CONFIG_INTRO_MESSAGE);
    var regex = /^(sk-).{48}/;
    const apiKey = await (0, prompts_1.text)({
        message: messages_1.YOUR_API_KEY,
        placeholder: messages_1.API_KEY_PLACEHOLDER,
        validate(value) {
            if (!regex.test(value)) {
                return messages_1.API_KEY_NOT_VALID;
            }
        },
    });
    const numberOfCommitMessages = await (0, prompts_1.text)({
        message: messages_1.NUMBER_OF_COMMIT_MESSAGES,
        placeholder: messages_1.NUMBER_OF_COMMIT_MESSAGES_PLACEHOLDER,
        validate(value) {
            if (isNaN(Number(value)) || Number(value) <= 0) {
                return messages_1.NOT_VALID_NUMBER;
            }
            else if (Number(value) > 10) {
                return messages_1.MORE_THAN_TEN_COMMIT_MESSAGES;
            }
        },
    });
    const file = (0, fs_1.writeFileSync)("./.gptcommit", apiKey.toString() + "\n" + numberOfCommitMessages.toString());
    (0, prompts_1.outro)(messages_1.CONFIG_OUTRO_MESSAGE);
}
exports.config = config;
