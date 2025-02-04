#!/usr/bin/env node

"use strict";

import * as fs from "fs";

/**
 * @return {void}
 * @method
 * @private
 */
const execute = () =>
{
    const indexPath = `${process.cwd()}/src/index.ts`;
    if (fs.existsSync(indexPath)) {

        const src = fs.readFileSync(indexPath, "utf8");
        const packageJson = JSON.parse(
            fs.readFileSync(`${process.cwd()}/package.json`, { "encoding": "utf8" })
        );

        const texts = src.split("\n");
        for (let idx = 0; idx < texts.length; ++idx) {

            const text = texts[idx];
            if (text.indexOf("Next2D Player") === -1) {
                continue;
            }

            const top   = texts.slice(0, idx).join("\n");
            const lower = texts.slice(idx + 1).join("\n");

            fs.writeFileSync(
                indexPath,
                `${top}
    console.log("%c Next2D Player %c ${packageJson.version} %c https://next2d.app",
${lower}`
            );

            break;
        }
    }
};

execute();