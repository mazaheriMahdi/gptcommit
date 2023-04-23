import {
  spinner,
  TextOptions,
  password,
  log,
  outro,
  intro,
  isCancel,
  text,
} from "@clack/prompts";
import { TextPrompt } from "@clack/core";
import { writeFileSync } from "fs";
import { json } from "stream/consumers";
import { API_KEY_NOT_VALID, API_KEY_PLACEHOLDER, CONFIG_INTRO_MESSAGE, CONFIG_OUTRO_MESSAGE, MORE_THAN_TEN_COMMIT_MESSAGES, NOT_VALID_NUMBER, NUMBER_OF_COMMIT_MESSAGES, NUMBER_OF_COMMIT_MESSAGES_PLACEHOLDER, YOUR_API_KEY } from "../messages/messages";

export async function config() {
  intro(CONFIG_INTRO_MESSAGE);
  var regex = /^(sk-).{48}/;
  const apiKey = await text({
    message: YOUR_API_KEY,
    placeholder: API_KEY_PLACEHOLDER,
    validate(value) {
      if (!regex.test(value)) {
        return API_KEY_NOT_VALID;
      }
    },
  });
  const numberOfCommitMessages = await text({
    message: NUMBER_OF_COMMIT_MESSAGES,
    placeholder: NUMBER_OF_COMMIT_MESSAGES_PLACEHOLDER,
    validate(value) {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        return NOT_VALID_NUMBER;
      } else if (Number(value) > 10) {
        return MORE_THAN_TEN_COMMIT_MESSAGES;
      }
    },
  });

  const file = writeFileSync(
    "./.gptcommit",
    apiKey.toString() + "\n" + numberOfCommitMessages.toString()
   );

  const addToGitIgnore = writeFileSync(
    "./.gitignore",
    "\n.gptcommit"
   );

  outro(CONFIG_OUTRO_MESSAGE);
}
