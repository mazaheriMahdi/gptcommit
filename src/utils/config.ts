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



export async function config() {
  intro("GptCommit Config");
  var regex = /^(sk-).{48}/;
  const apiKey = await text({
    message: "Your OpenAi Api key",
    placeholder: "sl-***************************",
    validate(value) {
      if (!regex.test(value)) {
        return "Invalid Api Key";
      }
    },
  });
  const numberOfCommitMessages = await text({
    message : "Number of commit messages to generate",
    placeholder : "3",
    validate(value){
        if(isNaN(Number(value)) || Number(value)<=0){
            return "Please enter a valid number";
        }else if(Number(value) > 10 ){
            return "Generating more than 10 commit messages is not allowed 😔" ;
        }
    }
  })
  const file = writeFileSync("./config.txt" , apiKey.toString() +  "\n" + numberOfCommitMessages.toString() )
  outro("You have successfully configured GptCommit🍺");
}
