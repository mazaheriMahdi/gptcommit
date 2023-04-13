import { gitDiff, commit, getUnStagedFiles, gitAdd } from "./git";
import { Configuration, OpenAIApi } from "openai";
import { GptCommit } from "./openAi/openAi";
import {
  intro,
  outro,
  spinner,
  select,
  log,
  MultiSelectOptions,
  multiselect,
  TextOptions,
  SelectOptions,
} from "@clack/prompts";
import { Arguments } from "yargs";
import { getConfig } from "./config/getConfig";
import { SendDiff } from "./openAi/sendToOpenAI";
interface optionList {
  value: string;
  label: string;
  hint?: string | undefined;
}

export async function Main(argv: Arguments) {
  intro("GPT-3 Commit Message Generator");

  // varilables ------------------------------------------------

  
  const s = spinner();
  const fileList = await getUnStagedFiles();

  // add file to stagging area------------------------------------------------
  const fileListOption: optionList[] = fileList.map((item) => {
    return { value: item, label: item } as optionList;
  });
  fileListOption.push({ value: "*", label: "all" });
  const selectedFiles = await multiselect({
    message: "Select files to add 🗃️",
    options: fileListOption,
  }).then((res) => {
    gitAdd(res as String[]);
  });
  log.success("Files added");

  const data = await gitDiff();
  // start getting data from open ai------------------------------------------------

  s.start("Generating commit message");

  const sender = new  SendDiff(data);
  const response = await  sender.send().catch((err) => {log.error(err.message)}).then((res)=>res as String[]);
  s.stop("Commit message generated");

  // select commit message fro commiting ------------------------------------------------

  log.info("Commit message:");
  const optionList: optionList[] = response.map((item) => {
    return { value: item, label: item } as optionList;
  });
  const commitMessage = await multiselect({
    message: "which commit message do you want to use ?",
    options: optionList,
  }).then((res) => res as String[]);

  // confrim that you want this commit message------------------------------------------------

  const confrim = await select({
    message: "Do you want to commit ?",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  }).then((value) => value as boolean);
  if (confrim) {
    s.start("Committing");
    await commit(
      commitMessage.length > 1 ? commitMessage.join("\n") : commitMessage[0]
    );
    s.stop("Commited 🍻");
  }

  // outro------------------------------------------------

  outro("Commit message generated");
}
