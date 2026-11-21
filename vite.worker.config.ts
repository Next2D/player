import { defineConfig } from "vite";

/**
 * @description Worker を iife 形式の単一ファイルにバンドルする設定
 *              Bundle each worker into a single iife file.
 *              使い方 / Usage: vite build -c vite.worker.config.ts --mode <renderer|unzip>
 */
const WORKERS = {
    "renderer": {
        "entry": "./packages/renderer/src/index.ts",
        "name": "RendererWorker",
        "fileName": "renderer.worker.bundle.js"
    },
    "unzip": {
        "entry": "./packages/display/src/Loader/worker/ZlibInflateWorker.ts",
        "name": "UnzipWorker",
        "fileName": "unzip.worker.bundle.js"
    }
} as const;

export default defineConfig(({ mode }) =>
{
    const worker = WORKERS[mode as keyof typeof WORKERS];
    if (!worker) {
        throw new Error(`Unknown worker mode: ${mode} (expected: ${Object.keys(WORKERS).join(", ")})`);
    }

    return {
        "publicDir": false,
        "build": {
            "outDir": "dist",
            "emptyOutDir": false,
            "target": "es2020",
            "minify": true,
            "sourcemap": false,
            "lib": {
                "entry": worker.entry,
                "name": worker.name,
                "formats": ["iife"],
                "fileName": () => worker.fileName
            }
        }
    };
});
