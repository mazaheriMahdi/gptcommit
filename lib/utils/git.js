"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitDiff = exports.gitAdd = exports.getUnStagedFiles = exports.commit = void 0;
const child_process_1 = require("child_process");
const prompts_1 = require("@clack/prompts");
const messages_1 = require("../messages/messages");
async function commit(message) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)("git commit -m '" + message + "'", (error, date) => {
            if (error) {
                prompts_1.log.error(error.message);
            }
            resolve(date);
        });
    });
}
exports.commit = commit;
async function getUnStagedFiles() {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('git status -s', (error, stdout) => {
            if (error) {
                reject(error);
            }
            else {
                const files = stdout.split("\n").map((item) => item.split(" ").pop());
                files[files.length - 1] == "" && files.pop();
                resolve(files);
            }
        });
    });
}
exports.getUnStagedFiles = getUnStagedFiles;
async function gitAdd(files) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('git add ' + files.join(" "), (error, stdout) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    }).catch((err) => { prompts_1.log.error(err.message); });
}
exports.gitAdd = gitAdd;
async function gitDiff() {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('git diff --staged --ignore-space-change', (error, stdout) => {
            if (error) {
                reject(error);
            }
            else if (stdout.length < 10) {
                reject(new Error(messages_1.NO_CHANGES_TO_COMMIT));
            }
            else {
                resolve(stdout);
            }
        });
    });
}
exports.gitDiff = gitDiff;
