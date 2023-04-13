import { GptCommit } from "./openAi";
import { getConfig } from "../config/getConfig";
import { resolve } from "path";
import { rejects } from "assert";
import {log} from "@clack/prompts"
export class SendDiff {
    data : String;
    constructor(data : String){
        this.data = data;
    }
    public async  send() {
        return new Promise<String[]>((resolve , rejects)=>{
            const config = getConfig().then((config)=>{
                const openAi = new GptCommit(Number(config[1]) , config[0] as string)
                openAi.getCommitMessage(this.data).then((data)=>resolve(data));
            }).catch((err)=>{
                
                log.error(err.message)
                process.exit(1);
            })
        })
    }

}