import type { Arguments, CommandBuilder } from 'yargs';
import {config} from  "../utils/config"
import {log} from '@clack/prompts'
type Options = {
  
};

export const command: string = 'config';
export const desc: string = 'config your gptCommit';

export const builder: CommandBuilder<Options, Options> = (yargs) =>yargs;

export const handler = (argv: Arguments<Options>): void => {

  config().catch((e)=>log.error(e.message))
};