
import { readFile , existsSync } from "fs";
export async function getConfig() : Promise<String[]>{
    if(existsSync("./config.txt")){
        return new Promise<String[]>((resolve , reject)=>{
            readFile("./config.txt" , (err , data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data.toString().split("\n"));
                }
            })
        })
    }else{
        throw new Error("You have not configured GptCommit yet. Please run gptCommit config to configure GptCommit")
    }
    
}