"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const git_1 = require("./git");
const prompts_1 = require("@clack/prompts");
const sendToOpenAI_1 = require("./openAi/sendToOpenAI");
async function Main(argv) {
    (0, prompts_1.intro)("GPT-3 Commit Message Generator");
    // varilables ------------------------------------------------
    const s = (0, prompts_1.spinner)();
    const fileList = await (0, git_1.getUnStagedFiles)();
    // add file to stagging area------------------------------------------------
    const fileListOption = fileList.map((item) => {
        return { value: item, label: item };
    });
    fileListOption.push({ value: "*", label: "all" });
    const selectedFiles = await (0, prompts_1.multiselect)({
        message: "Select files to add 🗃️",
        options: fileListOption,
    }).then((res) => {
        (0, git_1.gitAdd)(res);
    });
    prompts_1.log.success("Files added");
    const data = await (0, git_1.gitDiff)();
    // start getting data from open ai------------------------------------------------
    s.start("Generating commit message");
    const sender = new sendToOpenAI_1.SendDiff(data);
    const response = await sender.send().catch((err) => { prompts_1.log.error(err.message); }).then((res) => res);
    s.stop("Commit message generated");
    // select commit message fro commiting ------------------------------------------------
    prompts_1.log.info("Commit message:");
    const optionList = response.map((item) => {
        return { value: item, label: item };
    });
    const commitMessage = await (0, prompts_1.multiselect)({
        message: "which commit message do you want to use ?",
        options: optionList,
    }).then((res) => res);
    // confrim that you want this commit message------------------------------------------------
    const confrim = await (0, prompts_1.select)({
        message: "Do you want to commit ?",
        options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
        ],
    }).then((value) => value);
    if (confrim) {
        s.start("Committing");
        await (0, git_1.commit)(commitMessage.length > 1 ? commitMessage.join("\n") : commitMessage[0]);
        s.stop("Commited 🍻");
    }
    // outro------------------------------------------------
    (0, prompts_1.outro)("Commit message generated");
}
exports.Main = Main;
