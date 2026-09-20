import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

// Run the first-upload regression on WebKit as well as the normal Chrome suite.
export default defineConfig({
    ...base,
    "testMatch": "text-upload-batch.spec.ts",
    "projects": [{
        "name": "webgpu",
        "use": {
            ...devices["Desktop Safari"],
            "browserName": "webkit",
            "headless": false
        }
    }]
});
