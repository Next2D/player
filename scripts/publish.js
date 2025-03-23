#!/usr/bin/env node

"use strict";

import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
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

        const outDir  = join(process.cwd(), `dist/packages/${dirName}`);
        const packagePath = join(process.cwd(), `packages/${dirName}`);

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
            packageJson.dependencies = {};
            const keys = Object.keys(packageJson.peerDependencies);
            for (let idx = 0; idx < keys.length; ++idx) {
                if ("@next2d/renderer" === keys[idx]) {
                    continue;
                }
                packageJson.dependencies[keys[idx]] = basePackageJson.version;
            }

            delete packageJson.peerDependencies;
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
        `cp -r ${process.cwd()}/build/next2d.js ${process.cwd()}/dist/src/next2d.js`,
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

    // move
    spawnSync(
        `mkdir ${process.cwd()}/dist/src/src`,
        { "shell": true }
    );
    spawnSync(
        `mv ${process.cwd()}/dist/src/index.js ${process.cwd()}/dist/src/src/index.js`,
        { "shell": true }
    );
    spawnSync(
        `mv ${process.cwd()}/dist/src/index.d.ts ${process.cwd()}/dist/src/src/index.d.ts`,
        { "shell": true }
    );
};

execute();