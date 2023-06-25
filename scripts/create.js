#!/usr/bin/env node

"use strict";

const fs   = require("fs");
const path = require("path");
const cp   = require("child_process");

const execute = () =>
{

    const configPath = `${process.cwd()}/config/tsconfig.json`;
    const dirPath = `${process.cwd()}/src/`;

    const files = fs.readdirSync(dirPath);

    const dirList = files.filter((file) =>
    {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        const targetDirPath = path.join(dirPath, dirName);

        const nodeModulesPath = path.join(targetDirPath, "node_modules");
        if (fs.existsSync(nodeModulesPath)) {
            fs.rmdirSync(nodeModulesPath, { "recursive": true });
        }

        const stream = cp.spawn("npm", [
            "--prefix",
            targetDirPath,
            "install",
            targetDirPath
        ]);

        // eslint-disable-next-line no-loop-func
        stream.on("exit", () =>
        {
            const targetConfigPath = path.join(targetDirPath, "tsconfig.json");

            console.log("copy tsconfig.json: ", targetConfigPath);
            fs.cpSync(configPath, targetConfigPath);

            console.log("start tsc");
            const stream = cp.spawn("npx", [
                "tsc",
                "--project",
                targetConfigPath
            ]);

            // eslint-disable-next-line no-loop-func
            stream.on("exit", () =>
            {
                console.log("end tsc");
                fs.unlinkSync(targetConfigPath);
            });

            fs.unlinkSync(targetConfigPath);
        });
    }
};

execute();