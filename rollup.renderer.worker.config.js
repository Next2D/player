import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    "input": "./packages/renderer/src/index.ts",
    "output": {
        "file": "./dist/renderer.worker.bundle.js",
        "format": "iife",
        "name": "RendererWorker",
        "inlineDynamicImports": true
    },
    "plugins": [
        resolve({ "browser": true, "preferBuiltins": false }),
        commonjs(),
        typescript({ "tsconfig": "./tsconfig.json" }),
        terser()
    ]
};
