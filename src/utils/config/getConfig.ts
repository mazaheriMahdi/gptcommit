
import { readFile , existsSync } from "fs";
import { ConfigNotFound } from "../../Exeptions/ConfigNotFound";
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
        throw new ConfigNotFound();
    }
    
}