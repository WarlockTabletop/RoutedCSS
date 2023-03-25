import yargs, {  } from "yargs"
import fs, { readFileSync } from "fs"
import chokidar from "chokidar"
import { getNewDebounce } from "./debounce";
import { run_command } from "./Shell";
import { startBuild } from "./build";
import path from "path";

export enum EnvironmentMode {
    PROD,
    DEV
}
export interface CommandArguments {
    [x: string]: unknown; 
    _: (string | number)[]; 
    $0: string; 
    
    //arguments
}
export interface BuildConfig {
    sourceDir:string,
    buildFile:string,
    directoryAware?:{
        excludeFolders:string[]
    }
}
const argv = yargs
    // @ts-ignore
    .command('compile', 'start the server', (yargs) => {
        return yargs
    })
    
    .help()
    .alias('help', 'h').argv;
let start = async (args:CommandArguments)=>{
    let build_config_loc = path.resolve(process.cwd(),"./cbss.config.json")
    console.log(build_config_loc)
    let build_config_string = readFileSync(build_config_loc, {encoding:"utf-8"})
    let build_config:BuildConfig = JSON.parse(build_config_string);
    if (args._[0] == "compile") {
        startBuild(build_config, args)
    }
}
(async ()=>{
    let args = argv;
    if (args instanceof Promise) 
        args = await args;

    let curr_mode = EnvironmentMode.DEV
    if (args.mode == "production")
        curr_mode = EnvironmentMode.PROD

    start({
        ...args,
        mode:curr_mode
    });
})()
    

