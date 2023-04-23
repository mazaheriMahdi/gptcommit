"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const git_1 = require("./git");
const prompts_1 = require("@clack/prompts");
const sendToOpenAI_1 = require("./openAi/sendToOpenAI");
const messages_1 = require("../messages/messages");
// TODO : let uesr edit commit message
// TODO : make global config file
async function Main(argv) {
    (0, prompts_1.intro)(messages_1.COMMIT_INTRO_MESSAGE);
    // varilables ------------------------------------------------
    const s = (0, prompts_1.spinner)();
    const fileList = await (0, git_1.getUnStagedFiles)();
    // add file to stagging area------------------------------------------------
    const fileListOption = fileList.map((item) => {
        return { value: item, label: item };
    });
    fileListOption.push({ value: "*", label: "All" });
    const selectedFiles = await (0, prompts_1.multiselect)({
        message: messages_1.SELECT_FILES_TO_ADD,
        options: fileListOption,
    }).then((res) => {
        (0, git_1.gitAdd)(res);
    });
    prompts_1.log.success(messages_1.FILES_ADDED);
    const data = await (0, git_1.gitDiff)();
    // start getting data from open ai------------------------------------------------
    s.start(messages_1.GENERATING_COMMIT_MESSAGE);
    const sender = new sendToOpenAI_1.SendDiff(data);
    const response = await sender.send().catch((err) => {
        prompts_1.log.error(err.message);
    }).then((res) => res);
    s.stop(messages_1.COMMIT_MESSAGE_GENERATED);
    // select commit message fro commiting ------------------------------------------------
    const optionList = response.map((item) => {
        return { value: item, label: item };
    });
    const commitMessage = await (0, prompts_1.multiselect)({
        message: messages_1.WHICH_COMMIT_MESSAGE_DO_YOU_WANT_TO_USE,
        options: optionList,
    }).then((res) => res);
    const doYouWantToEdit = await (0, prompts_1.select)({
        message: messages_1.DO_WANT_TO_EDIT,
        options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
        ]
    });
    let joinedCommitMeassage = commitMessage.join("\n");
    if (doYouWantToEdit) {
        const editCommitMessage = await (0, prompts_1.text)({
            message: "Edit commit message",
            initialValue: joinedCommitMeassage,
            validate: (value) => {
                if (value == joinedCommitMeassage) {
                    return "Please change the commit message and then hit enter";
                }
            }
        }).then((value) => joinedCommitMeassage = value);
    }
    // confrim that you want this commit message------------------------------------------------
    const confrim = await (0, prompts_1.select)({
        message: messages_1.DO_YOU_WANT_TO_COMMIT,
        options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
        ],
    }).then((value) => value);
    if (confrim) {
        s.start(messages_1.COMMITING);
        await (0, git_1.commit)(joinedCommitMeassage);
        s.stop(messages_1.COMMITED);
    }
    // outro------------------------------------------------
    (0, prompts_1.outro)(messages_1.COMMIT_OUTRO_MESSAGE);
}
exports.Main = Main;
