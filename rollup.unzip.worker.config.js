import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    "input": "./packages/display/src/Loader/worker/ZlibInflateWorker.ts",
    "output": {
        "file": "./dist/unzip.worker.bundle.js",
        "format": "iife",
        "name": "UnzipWorker",
        "inlineDynamicImports": true
    },
    "plugins": [
        resolve({ "browser": true, "preferBuiltins": false }),
        commonjs(),
        typescript({ "tsconfig": "./tsconfig.json" }),
        terser()
    ]
};