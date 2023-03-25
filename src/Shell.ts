import {execSync} from "child_process";

export function run_command(cmds:string[]) {
    let cmd = ""
    //cmd += "@echo off && "
    cmd += cmds.map((cmd)=>{
        return `echo "${cmd}" && ${cmd}`
    }).join(" && ") 
    cmd += " && timeout 5"
    cmd += " && exit"
    execSync(`start cmd /k "${cmd}"`)
}