#!/usr/bin/env node

"use strict";

const fs   = require("fs");
const path = require("path");
const cp   = require("child_process");

const execute = () =>
{
    const dirPath = `${process.cwd()}/packages/`;

    const files = fs.readdirSync(dirPath);

    const dirList = files.filter((file) =>
    {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });

    const options = [
        "--project",
        path.join(process.cwd(), "config/tsconfig.json"),
        "--outDir"
    ];

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        const packagePath = path.join(dirPath, dirName);

        const outDir = path.join(packagePath, "dist");
        if (fs.existsSync(outDir)) {
            fs.rmdirSync(outDir, { "recursive": true });
        }

        console.log(
            `npx tsc ${path.join(packagePath, "src/**/*.ts")} ${options.join(" ")} ${outDir}`
        );
        cp.spawnSync(
            `npx tsc ${path.join(packagePath, "src/**/*.ts")} ${options.join(" ")} ${outDir}`,
            { "shell": true }
        );
    }
};

execute();