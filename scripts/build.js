#!/usr/bin/env node

"use strict";

import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const execute = () =>
{
    const dirPath = `${process.cwd()}/packages/`;

    const files = readdirSync(dirPath);

    const dirList = files.filter((file) =>
    {
        return statSync(join(dirPath, file)).isDirectory();
    });

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        const targetPath  = join(process.cwd(), `dist/packages/${dirName}/src`);
        const packagePath = join(dirPath, dirName);

        const outDir = join(packagePath, "dist");
        if (existsSync(outDir)) {
            spawnSync(`rm -rf ${outDir}`, { "shell": true });
        }

        spawnSync(
            `mv ${targetPath} ${outDir}`,
            { "shell": true }
        );
    }

    const distPath = `${process.cwd()}/dist`;
    if (existsSync(distPath)) {
        spawnSync(`rm -rf ${distPath}`, { "shell": true });
    }
};

execute();