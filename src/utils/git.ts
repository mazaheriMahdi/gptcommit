import {exec} from 'child_process';
import {log} from '@clack/prompts';
import { resolve } from 'path';


export async function commit(message: String) : Promise<String> {
    return new Promise<String> ((resolve , reject)=>{
        exec('git commit -m "' + message + '"', (error, date) => {
            if (error) {
                log.error(error.message);
            }
            resolve(date);
    
        });
    })
}
export async function getUnStagedFiles() {
    return new Promise<String[]> ((resolve , reject)=>{
        exec('git status -s' , (error , stdout)=>{
            if(error){
                reject(error);
            }else{
                const files = stdout.split("\n").map((item)=>item.split(" ").pop() as string);
                files[files.length-1]==""&&files.pop();
                resolve(files);
            }
        })
    });
    
}
export async function gitAdd(files :  String[]) {
    return new Promise<String>((resolve, reject) => {
        
        
        exec('git add '+ files.join(" "), (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    }).catch((err)=>{log.error(err.message)});
}
export async function gitDiff() {
    return new Promise<String>((resolve, reject) => {
        exec('git diff --staged --ignore-space-change',  (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}