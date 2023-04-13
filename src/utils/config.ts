import { spinner ,TextOptions, password  , log , outro , intro , isCancel , text } from "@clack/prompts";
import {TextPrompt} from "@clack/core"


export async function config(){
    intro("GptCommit Config")
    var regex = /^(sk-).{48}/
    const apiKey = await text({message : "Your OpenAi Api key" , placeholder: "sl-***************************" , validate(value) {
        if(!regex.test(value)){
            return "Invalid Api Key"
        }
    },})
    outro("You have successfully configured GptCommit🍺")
}