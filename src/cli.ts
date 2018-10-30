#!/usr/bin/env node
// Wrapper for rubber as a CLI
// Has almost the same functionality as
// using it from JS, besides the ability
// to process output.
import * as cli from "cli";
import { default as chalk } from "chalk";
import { readFileSync, existsSync, statSync, readdirSync, PathLike } from "fs";
import { join, resolve } from "path";
import * as rubber from './rubber';
cli.setUsage("rubber [options] path/to/project.yyp [output file]");

/**
 * Preform basic checks to see if a .yyp is actually valid.
 */
function validateYYP(path: PathLike) {
    let projectRead;
    try {
        projectRead = JSON.parse(readFileSync(path).toString());
    } catch (e) {
        projectRead = {};
    }
    return ("IsDnDProject" in projectRead) &&
        ("id" in projectRead) &&
        ("mvc" in projectRead) &&
        ("resources" in projectRead) &&
        (projectRead.modelName === "GMProject");
}

// Prepare CLI Options.
const options = cli.parse({
    zip: ["Z", "Creates a zip archive"],
    installer: ["I", "Creates a installer package"],
    yyc: ["y", "Compiles with YYC"],
    config: ["c", "Sets the configuration", "string"],
    version: ["v", "Display the current version"],
    clear: ["", "Clears cache for project and exits."],
    "gms-dir":["","Alternative GMS installation directory","path"],
});
// CLI calls the callback with the arguments and options.
cli.main((args, options) => {
    if (options.version) {
        // Output version and if build tools are all set.
        const packagejson = JSON.parse(readFileSync(join(__dirname, "../package.json")).toString());
        console.log(`Rubber ` + chalk.green(`v${packagejson.version}`));
        return;
    }
    if (args.length == 0) {
        cli.fatal("Missing project path. Exiting");
    }
    let path = resolve(args[0]);
    // !!! #4 Removed the yyz check from an older verison. This can
    //        be fixed by adding it again, extracting it somewhere temporary.
    if (statSync(path).isDirectory()) {
        // Check inside the directory
        for (const name of readdirSync(path)) {
            if (!statSync(join(path, name)).isDirectory()) {
                if (validateYYP(join(path, name))) {
                    path = join(path, name);
                    break;
                }
            }
        }
    }
    if (!existsSync(path)) {
        cli.fatal("Project does not exist at " + chalk.yellow(path) + ". Exiting");
        return;
    }

    // Preform some checks to the project.
    
    if (!validateYYP(path)) {
        cli.fatal("Project invalid, or in a newer format. Exiting");
    }

    // Clear cache option
    if(options.clear) {
        rubber.clearCache(path).then(() => {
            cli.info("Cleared Project Cache.");
        });
        return;
    }

    // We have a probably valid project. Time to pass it to rubber
    let buildType: "test" | "zip" | "installer" = "test";
    if (options.zip && options.installer) {
        // why did you even?
        cli.fatal("Cannot make a zip and installer :)   Use two different cli calls. Exiting")
    }
    if (options.zip) {
        buildType = "zip";
    }
    if (options.installer) {
        buildType = "installer";
    }
    
    let gamemakerLocation: string = "";
    if (options["gms-dir"]){
        gamemakerLocation = options["gms-dir"];
        console.log("install dir:"+gamemakerLocation);
    }
    // Use the api to compile the project.
    const build = rubber.windows({
        projectPath: path,
        build: buildType,
        outputPath: args[1] || "",
        yyc: options.yyc,
        config: options.config || "default",
        verbose: options.debug,
        gamemakerLocation
    });
    build.on("compileStatus", (data:string) => {
        // Errors will be marked in red
        if(data.toLowerCase().startsWith("error")) {
            data = chalk.redBright(data);
        }
        process.stdout.write(data);
    });
    build.on("gameStatus", (data: string) => {
        process.stdout.write(data);
    });
    build.on("gameStarted", () => {
        // space out the compile log and the game log a bit.
        console.log("\n");
    });
    let igorErrors = false;
    build.on("compileFinished", (errors: string[]) => {
        if(errors.length > 0) {
            igorErrors = true;
            console.log(chalk.redBright("Compile Errors:"));
            errors.forEach(err => {
                console.log("  " + chalk.redBright(err));
            });
        }
    });
    build.on("allFinished", () => {
        if(!igorErrors)
            console.log(chalk.green("Compile Finished"));
    });
    build.on("error", (error: any) => {
        if (!igorErrors)
            cli.fatal(error.message);
    });
});