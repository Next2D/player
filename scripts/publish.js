#!/usr/bin/env node

"use strict";

const fs   = require("fs");
const path = require("path");
const cp   = require("child_process");

const execute = () =>
{
    const dirPath = `${process.cwd()}/dist/packages/`;

    const files = fs.readdirSync(dirPath);

    const dirList = files.filter((file) =>
    {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });

    const basePackageJson = JSON.parse(
        fs.readFileSync(`${process.cwd()}/package.json`, { "encoding": "utf8" })
    );

    for (let idx = 0; idx < dirList.length; ++idx) {

        const dirName = dirList[idx];

        basePackageJson.dependencies[`@next2d/${dirName}`] = basePackageJson.version;

        const targetPath  = path.join(process.cwd(), `dist/packages/${dirName}/src`);
        const packagePath = path.join(process.cwd(), `packages/${dirName}`);

        const outDir = path.join(process.cwd(), `dist/packages/${dirName}`);
        if (fs.existsSync(`${outDir}/dist`)) {
            cp.spawnSync(`rm -rf ${outDir}`, { "shell": true });
        }

        cp.spawnSync(
            `mv ${targetPath} ${outDir}/dist`,
            { "shell": true }
        );

        // LICENSE
        cp.spawnSync(
            `cp -r ${packagePath}/LICENSE ${outDir}/LICENSE`,
            { "shell": true }
        );

        // README
        cp.spawnSync(
            `cp -r ${packagePath}/README.md ${outDir}/README.md`,
            { "shell": true }
        );

        // package.json
        const packageJson = JSON.parse(
            fs.readFileSync(`${packagePath}/package.json`, { "encoding": "utf8" })
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
        fs.writeFileSync(
            `${outDir}/package.json`,
            JSON.stringify(packageJson, null, 2)
        );
    }

    if (basePackageJson.peerDependencies) {
        delete basePackageJson.peerDependencies;
    }

    basePackageJson.main = "next2d.min.js";

    // write package.json
    fs.writeFileSync(
        path.join(process.cwd(), "dist/src/package.json"),
        JSON.stringify(basePackageJson, null, 2)
    );

    // minify
    cp.spawnSync(
        `cp -r ${process.cwd()}/next2d.js ${process.cwd()}/dist/src/next2d.min.js`,
        { "shell": true }
    );

    // LICENSE
    cp.spawnSync(
        `cp -r ${process.cwd()}/LICENSE ${process.cwd()}/dist/src/LICENSE`,
        { "shell": true }
    );

    // README
    cp.spawnSync(
        `cp -r ${process.cwd()}/README.md ${process.cwd()}/dist/src/README.md`,
        { "shell": true }
    );
};

execute();