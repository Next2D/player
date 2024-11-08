#!/usr/bin/env node

"use strict";

import { readdirSync, statSync, readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const execute = () =>
{
    const dirPath = `${process.cwd()}/dist/packages/`;

    const files = readdirSync(dirPath);

    const dirList = files.filter((file) =>
    {
        return statSync(join(dirPath, file)).isDirectory();
    });

    const basePackageJson = JSON.parse(
        readFileSync(`${process.cwd()}/package.json`, { "encoding": "utf8" })
    );

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        basePackageJson.dependencies[`@next2d/${dirName}`] = basePackageJson.version;

        const targetPath  = join(process.cwd(), `dist/packages/${dirName}/src`);
        const packagePath = join(process.cwd(), `packages/${dirName}`);

        const outDir = join(process.cwd(), `dist/packages/${dirName}`);
        if (existsSync(`${outDir}/dist`)) {
            spawnSync(`rm -rf ${outDir}`, { "shell": true });
        }

        spawnSync(
            `mv ${targetPath} ${outDir}/dist`,
            { "shell": true }
        );

        // LICENSE
        spawnSync(
            `cp -r ${packagePath}/LICENSE ${outDir}/LICENSE`,
            { "shell": true }
        );

        // README
        spawnSync(
            `cp -r ${packagePath}/README.md ${outDir}/README.md`,
            { "shell": true }
        );

        // package.json
        const packageJson = JSON.parse(
            readFileSync(`${packagePath}/package.json`, { "encoding": "utf8" })
        );

        // write version
        packageJson.version = basePackageJson.version;

        if (packageJson.peerDependencies) {
            const keys = Object.keys(packageJson.peerDependencies);
            for (let idx = 0; idx < keys.length; ++idx) {
                packageJson.peerDependencies[keys[idx]] = basePackageJson.version;
            }
        }

        // write package.json
        writeFileSync(
            `${outDir}/package.json`,
            JSON.stringify(packageJson, null, 2)
        );
    }

    if (basePackageJson.peerDependencies) {
        delete basePackageJson.peerDependencies;
    }

    // write package.json
    writeFileSync(
        join(process.cwd(), "dist/src/package.json"),
        JSON.stringify(basePackageJson, null, 2)
    );

    // minify
    spawnSync(
        `cp -r ${process.cwd()}/next2d.js ${process.cwd()}/dist/src/dist/next2d.min.js`,
        { "shell": true }
    );

    // LICENSE
    spawnSync(
        `cp -r ${process.cwd()}/LICENSE ${process.cwd()}/dist/src/LICENSE`,
        { "shell": true }
    );

    // README
    spawnSync(
        `cp -r ${process.cwd()}/README.md ${process.cwd()}/dist/src/README.md`,
        { "shell": true }
    );
};

execute();