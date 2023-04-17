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
import { COMMITED, COMMITING, COMMIT_INTRO_MESSAGE, COMMIT_MESSAGE_GENERATED, COMMIT_OUTRO_MESSAGE, DO_YOU_WANT_TO_COMMIT, FILES_ADDED, GENERATING_COMMIT_MESSAGE, SELECT_FILES_TO_ADD, WHICH_COMMIT_MESSAGE_DO_YOU_WANT_TO_USE } from "../messages/messages";
interface optionList {
  value: string;
  label: string;
  hint?: string | undefined;
}

export async function Main(argv: Arguments) {
  intro(COMMIT_INTRO_MESSAGE);

  // varilables ------------------------------------------------

  
  const s = spinner();
  const fileList = await getUnStagedFiles();

  // add file to stagging area------------------------------------------------
  const fileListOption: optionList[] = fileList.map((item) => {
    return { value: item, label: item } as optionList;
  });
  fileListOption.push({ value: "*", label: "All" });
  const selectedFiles = await multiselect({
    message: SELECT_FILES_TO_ADD,
    options: fileListOption,
  }).then((res) => {
    gitAdd(res as String[]);
  });
  log.success(FILES_ADDED);

  const data = await gitDiff();
  // start getting data from open ai------------------------------------------------

  s.start(GENERATING_COMMIT_MESSAGE);

  const sender = new  SendDiff(data);
  const response = await  sender.send().catch((err) => {
    log.error(err.message)
  }).then((res)=>res as String[]);
  s.stop(COMMIT_MESSAGE_GENERATED);

  // select commit message fro commiting ------------------------------------------------

  const optionList: optionList[] = response.map((item) => {
    return { value: item, label: item } as optionList;
  });
  const commitMessage = await multiselect({
    message:WHICH_COMMIT_MESSAGE_DO_YOU_WANT_TO_USE,
    options: optionList,
  }).then((res) => res as String[]);

  // confrim that you want this commit message------------------------------------------------

  const confrim = await select({
    message: DO_YOU_WANT_TO_COMMIT,
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  }).then((value) => value as boolean);
  if (confrim) {
    s.start(COMMITING);
    await commit(
      commitMessage.length > 1 ? commitMessage.join("\n") : commitMessage[0]
    );
    s.stop(COMMITED);
  }

  // outro------------------------------------------------

  outro(COMMIT_OUTRO_MESSAGE);
}
