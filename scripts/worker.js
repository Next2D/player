#!/usr/bin/env node

"use strict";

import { readFileSync, writeFileSync } from "fs";

const rendererWorker = () =>
{
    const workerCode   = readFileSync(`${process.cwd()}/dist/renderer.worker.bundle.js`, "utf-8");
    const workerBase64 = Buffer.from(workerCode, "utf-8").toString("base64");

    writeFileSync(
        `${process.cwd()}/dist/packages/core/src/renderer.worker.inline.js`,
        `export const workerInlineUrl = 'data:application/javascript;base64,${workerBase64}';`
    );

    const src = `import workerInlineUrl from "./renderer.worker.inline.js";
export const $rendererWorker = new Worker(workerInlineUrl);
`;
    writeFileSync(
        `${process.cwd()}/dist/packages/core/src/RendererWorker.js`,
        src
    );
};

const unzipWorker = () =>
{
    const workerCode   = readFileSync(`${process.cwd()}/dist/unzip.worker.bundle.js`, "utf-8");
    const workerBase64 = Buffer.from(workerCode, "utf-8").toString("base64");

    writeFileSync(
        `${process.cwd()}/dist/packages/display/src/Loader/worker/unzip.worker.inline.js`,
        `export const workerInlineUrl = 'data:application/javascript;base64,${workerBase64}';`
    );

    const src = `import workerInlineUrl from "./unzip.worker.inline.js";
export const $unzipWorker = new Worker(workerInlineUrl);
`;
    writeFileSync(
        `${process.cwd()}/dist/packages/display/src/Loader/worker/UnzipWorker.js`,
        src
    );
};

rendererWorker();
unzipWorker();