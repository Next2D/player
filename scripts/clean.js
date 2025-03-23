#!/usr/bin/env node

"use strict";

import { existsSync } from "fs";
import { spawnSync } from "child_process";

const execute = () =>
{
    const distPath = `${process.cwd()}/dist`;
    if (existsSync(distPath)) {
        spawnSync(`rm -rf ${distPath}`, { "shell": true });
    }

    const buildPath = `${process.cwd()}/build`;
    if (existsSync(buildPath)) {
        spawnSync(`rm -rf ${buildPath}`, { "shell": true });
    }
};

execute();