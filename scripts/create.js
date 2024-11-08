#!/usr/bin/env node

"use strict";

import { readdirSync, statSync, existsSync, rmdirSync, cpSync, unlinkSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

const execute = () =>
{

    const configPath = `${process.cwd()}/config/tsconfig.json`;
    const dirPath = `${process.cwd()}/src/`;

    const files = readdirSync(dirPath);

    const dirList = files.filter((file) =>
    {
        return statSync(join(dirPath, file)).isDirectory();
    });

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        const targetDirPath = join(dirPath, dirName);

        const nodeModulesPath = join(targetDirPath, "node_modules");
        if (existsSync(nodeModulesPath)) {
            rmdirSync(nodeModulesPath, { "recursive": true });
        }

        const stream = spawn("npm", [
            "--prefix",
            targetDirPath,
            "install",
            targetDirPath
        ]);

        // eslint-disable-next-line no-loop-func
        stream.on("exit", () =>
        {
            const targetConfigPath = join(targetDirPath, "tsconfig.json");

            console.log("copy tsconfig.json: ", targetConfigPath);
            cpSync(configPath, targetConfigPath);

            console.log("start tsc");
            const stream = spawn("npx", [
                "tsc",
                "--project",
                targetConfigPath
            ]);

            // eslint-disable-next-line no-loop-func
            stream.on("exit", () =>
            {
                console.log("end tsc");
                unlinkSync(targetConfigPath);
            });

            unlinkSync(targetConfigPath);
        });
    }
};

execute();