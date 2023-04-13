"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GptCommit = void 0;
const openai_1 = require("openai");
class GptCommit extends openai_1.OpenAIApi {
    constructor(n, key) {
        super(new openai_1.Configuration({
            apiKey: key,
        }));
    }
    async getCommitMessage(data) {
        let choices = [];
        try {
            const response = await this.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: ("Generate commit message for \n" + data),
                    },
                ],
                n: 3,
            }).then((res) => res.data);
            choices = await response.choices.map((item) => item.message?.content);
        }
        catch (e) {
            choices = ["Connection Error"];
        }
        return choices;
    }
}
exports.GptCommit = GptCommit;
