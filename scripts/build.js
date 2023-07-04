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

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        const targetPath  = path.join(process.cwd(), `dist/packages/${dirName}/src`);
        const packagePath = path.join(dirPath, dirName);

        const outDir = path.join(packagePath, "dist");
        if (fs.existsSync(outDir)) {
            cp.spawnSync(`rm -rf ${outDir}`, { "shell": true });
        }

        cp.spawnSync(
            `mv ${targetPath} ${outDir}`,
            { "shell": true }
        );
    }

    const distPath = `${process.cwd()}/dist`;
    if (fs.existsSync(distPath)) {
        cp.spawnSync(`rm -rf ${distPath}`, { "shell": true });
    }
};

execute();