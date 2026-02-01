import { defineConfig, devices } from "@playwright/test";

/**
 * E2Eテスト設定
 *
 * WebGL/WebGPUの描画はヘッド付きモードで正確に動作するため、
 * 全テストはローカル環境でヘッド付きモードで実行することを推奨。
 *
 * スクリプト:
 * - npm run test:e2e:local        - 全テスト（WebGL + WebGPU）をヘッド付きで実行
 * - npm run test:e2e:local:webgl  - WebGLのみヘッド付きで実行
 * - npm run test:e2e:local:webgpu - WebGPUのみヘッド付きで実行
 * - npm run test:e2e:update       - スナップショット更新
 */

const isCI = !!process.env.CI;
// ヘッドレスモードを強制しない限り、常にヘッド付きで実行
const forceHeadless = process.env.HEADLESS === "true";

export default defineConfig({
    "testDir": "./tests",
    "fullyParallel": true,
    "forbidOnly": isCI,
    "retries": isCI ? 2 : 0,
    "workers": isCI ? 1 : undefined,
    "reporter": "html",
    "timeout": 60000,
    "expect": {
        "toHaveScreenshot": {
            "maxDiffPixels": 100,
            "threshold": 0.1,
            "timeout": 30000
        }
    },
    "use": {
        "baseURL": "http://localhost:5173",
        "trace": "on-first-retry",
        "video": "on-first-retry"
    },
    "projects": [
        {
            "name": "webgl",
            "use": {
                ...devices["Desktop Chrome"],
                // デフォルトでヘッド付きモード（WebGLの正確な描画のため）
                "headless": forceHeadless,
                "launchOptions": {
                    "args": [
                        "--use-gl=angle",
                        "--use-angle=default"
                    ]
                }
            },
            "snapshotDir": "./snapshots/webgl"
        },
        {
            "name": "webgpu",
            "use": {
                ...devices["Desktop Chrome"],
                // WebGPUはヘッド付きモードが必須
                "headless": forceHeadless,
                "launchOptions": {
                    "args": [
                        "--enable-unsafe-webgpu",
                        "--enable-features=Vulkan"
                    ]
                }
            },
            "snapshotDir": "./snapshots/webgpu"
        }
    ],
    "webServer": {
        "command": "npm start",
        "url": "http://localhost:5173",
        "reuseExistingServer": !isCI,
        "timeout": 120000,
        "cwd": ".."
    }
});
