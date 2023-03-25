import { BuildConfig } from "../main";
import * as parseCSS from "./parse_css.js"

class CBSSEngine {
    buildConfig:BuildConfig
    directoryAware: {
        excludeFolders:string[]
    } | undefined;
    constructor(config:BuildConfig) {
        this.buildConfig = config;
        this.directoryAware = config.directoryAware
    }
    tokenArray2CompString(tokens:any[]) {
        let directory = "";
        for (let i = 0; i < tokens.length; i++) {
            console.log("compe", tokens[i]);
            if (tokens[i].tokenType == 'WHITESPACE') continue;
            if (tokens[i].tokenType == 'IDENT') {
                if (directory.length != 0) directory += "_"
                directory += tokens[i].value
            }

        }
        console.log("directory", directory)
        return directory
    }
    fileDirectoryToCompPrefix(file:string) {
        if (this.directoryAware == undefined) return "";
        let excludedFolders = this.directoryAware.excludeFolders;
        let splitName = file.split("/").join("\\\\").split("\\");
        console.log("splitName", splitName)
        splitName = splitName.slice(0, splitName.length-1)
        splitName = splitName.map(loc=>excludedFolders.includes(loc) ? "" : loc)
        return splitName.filter(loc => loc.length > 0).join("_")
    }
    processFile(fileName: string, cbss: string) {
        // Extract units from @--custom-units at-rules
        let new_sheet = ""
        let CompPrefix = this.fileDirectoryToCompPrefix(fileName);
        parseCSS.parseAStylesheet(cbss).value.forEach(rule => {
            if (rule.type === 'AT-RULE' && rule.name === 'Component') {
                if (CompPrefix.length != 0) CompPrefix += "_"
                CompPrefix += this.tokenArray2CompString(rule.prelude);
                let content:string = rule.value.toSource();
                content = content.substring(1, content.length-1)
                let sheet = ""
                parseCSS.parseAStylesheet(content).value.forEach(rule => {
                    console.log("subrule", rule)
                    let prev_token:{value:string} = {value:""};
                    rule.prelude = rule.prelude.map(
                        (token:{tokenType:string, value:any})=>{
                            if (token.tokenType == "IDENT" && [".", "#"].includes(prev_token.value))
                                token.value = CompPrefix+"_"+token.value;
                            prev_token = token;
                            return token
                        }
                    )
                    sheet += rule.toSource() + "\n";
                });
                
                console.log(rule, CompPrefix, sheet)
                new_sheet += sheet + "\n"
            } else {
                let prev_token:{value:string} = {value:""};
                rule.prelude = rule.prelude.map(
                    (token:{tokenType:string, value:any})=>{
                        if (token.tokenType == "IDENT" && [".", "#"].includes(prev_token.value))
                            token.value = CompPrefix+"_"+token.value;
                        prev_token = token;
                        return token
                    }
                )
                new_sheet += rule.toSource() + "\n";
            }
        })
        return new_sheet
    }

}

let engine:CBSSEngine|null = null;
export function getEngine(config:BuildConfig) {
    if (engine == null) 
        engine = new CBSSEngine(config)
    return engine
}