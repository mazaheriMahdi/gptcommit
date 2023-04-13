import { Arguments, CommandBuilder } from "yargs";
import  {Main}  from "../utils/main";
import { log } from "@clack/prompts";

type Options = {
  a: boolean | undefined;
  y: boolean | undefined;
};

export const command: string = "commit";
export const desc: string = "Generating AI commit messages";

export const bulder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    a: { type: "boolean" } ,
    y: { type: "boolean" },
  });

export const handler = (argv: Arguments<Options>): void => {
    Main(argv).catch((err) => {
        
        log.error(err.message
            
            
            
            )});
};
