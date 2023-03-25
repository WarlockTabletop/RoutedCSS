import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import path from "path";
import { getEngine } from "./Engine";
import { BuildConfig, CommandArguments } from "./main";
import { run_command } from "./Shell";


export function startBuild(config:BuildConfig, args:CommandArguments) {
    let files = getDirectorySearch(config.sourceDir, {
        filetypes:["cbss", "css"]
    })
    let combined_css = (`
        .STOP_CASCADING {
            all: initial;
        }
    `.split("\t\t").join("").split("        ").join("")) + "\n";
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        let cbss = readFileSync(files[i], {encoding:"utf-8"});
        let engine = getEngine(config)

        combined_css += `/*${files[i]}*/\n`+ engine.processFile(files[i], cbss) + "\n\n"
    }
    let dir_array:string[] = config.buildFile.split("/");
    let dir = dir_array.slice(0, dir_array.length-1).join("/")
    mkdirSync(dir, {
        recursive:true
    })
    let manifest:{[key:string]:any} = {};
    try {
        manifest = JSON.parse(readFileSync(dir+"/manifest.json", {encoding:"utf-8"}))
    } catch{}
    manifest["cbss"] = config.buildFile.split("/").pop()
    writeFileSync(config.buildFile, combined_css)
    writeFileSync(dir+"/manifest.json", JSON.stringify(manifest, null, 4))
}

function getDirectorySearch(dir:string, options:{
    filetypes:string[]
}) {
    let Files:string[]  = [];
    let ThroughDirectory = (Directory:string) => {
        readdirSync(Directory).forEach(File => {
            const Absolute = path.join(Directory, File);
            if (statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
            else{
                for (let i = 0; i < options.filetypes.length; i++){
                    let filetype_length = options.filetypes[i].length;
                    if (Absolute.slice(Absolute.length-filetype_length, Absolute.length) == options.filetypes[i])
                        return Files.push(Absolute);
                }
            }
        });
    }
    ThroughDirectory(dir)
    return Files;
}
