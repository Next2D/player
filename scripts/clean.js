#!/usr/bin/env node

"use strict";

import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const execute = () =>
{
    const distPath = `${process.cwd()}/dist`;
    if (existsSync(distPath)) {
        spawnSync(`rm -rf ${distPath}`, { "shell": true });
    }

    const dirPath = `${process.cwd()}/packages/`;

    const files = readdirSync(dirPath);

    const dirList = files.filter((file) =>
    {
        return statSync(join(dirPath, file)).isDirectory();
    });

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        const packagePath = join(dirPath, dirName);

        const outDir = join(packagePath, "dist");
        if (existsSync(outDir)) {
            spawnSync(`rm -rf ${outDir}`, { "shell": true });
        }
    }
};

execute();