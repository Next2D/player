import { defineConfig } from "@playwright/test";

export default defineConfig({
    "testDir": "./tests",
    "testMatch": "sound-stream.spec.ts",
    "timeout": 30000,
    "workers": 1,
    "reporter": "list",
    "use": {
        "baseURL": "http://localhost:5373",
        "headless": true
    },
    "projects": [
        { "name": "chromium", "use": { "browserName": "chromium" } },
        { "name": "webkit", "use": { "browserName": "webkit" } }
    ],
    "webServer": {
        "command": "npx vite --host --port 5373 --strictPort",
        "url": "http://localhost:5373",
        "reuseExistingServer": false,
        "cwd": ".."
    }
});
