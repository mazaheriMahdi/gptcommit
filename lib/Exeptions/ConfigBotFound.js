"use strict";
class ConfigNotFound extends Error {
    constructor() {
        super('You have not configured GptCommit yet. Please run gptCommit config to configure GptCommit');
    }
}
