/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="vitest/config" />

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    "server": {
        "open": "index.html"
    },
    "build": {
        "outDir": "build",
        "target": "esnext",
        "modulePreload": {
            "polyfill": false
        },
        "rollupOptions": { //ファイル出力設定
            "output": {
                "entryFileNames": "next2d.js"
            }
        }
    },
    "resolve": {
        "alias": {
            "@": path.resolve(process.cwd(), "/")
        }
    },
    "test": {
        "globals": true,
        "environment": "jsdom",
        "setupFiles": [
            "test.setup.ts",
            "@vitest/web-worker",
            "vitest-webgl-canvas-mock"
        ],
        "include": ["packages/**/*.test.ts"]
    }
});