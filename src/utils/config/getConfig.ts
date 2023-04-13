import { readFile, existsSync } from "fs";
import { ConfigNotFound } from "../../Exeptions/ConfigNotFound";
import { log } from "@clack/prompts";
import { rejects } from "assert";
export async function getConfig(): Promise<String[]> {
  return new Promise<String[]>((resolve, reject) => {
    if (existsSync("./config.txt")) {
      readFile("./config.txt", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString().split("\n"));
        }
      });
    } else {
      reject(new ConfigNotFound());
      
    }
  });
}
